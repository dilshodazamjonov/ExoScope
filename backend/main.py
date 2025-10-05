from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.coordinates import convert_to_radec
from services.nasa_api import get_exoplanets_in_view, get_exoplanet_info
from datetime import datetime
import math

app = FastAPI(title="Exoplanet Scope API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CameraData(BaseModel):
    latitude: float
    longitude: float
    azimuth: float
    altitude: float
    fov: float = 5.0

def radec_to_azalt(ra, dec, latitude, longitude):
    """
    Convert RA/Dec to Azimuth/Altitude for a given location
    This is a simplified calculation - for production use astropy
    """
    from datetime import datetime
    import math
    
    # Get current time
    now = datetime.utcnow()
    
    # Calculate Local Sidereal Time (simplified)
    J2000 = datetime(2000, 1, 1, 12, 0, 0)
    days_since_j2000 = (now - J2000).total_seconds() / 86400.0
    LST = (100.46 + 0.985647 * days_since_j2000 + longitude + 15 * (now.hour + now.minute/60.0 + now.second/3600.0)) % 360
    
    # Calculate Hour Angle
    HA = (LST - ra) % 360
    if HA > 180:
        HA -= 360
    
    # Convert to radians
    HA_rad = math.radians(HA)
    dec_rad = math.radians(dec)
    lat_rad = math.radians(latitude)
    
    # Calculate altitude
    sin_alt = math.sin(dec_rad) * math.sin(lat_rad) + math.cos(dec_rad) * math.cos(lat_rad) * math.cos(HA_rad)
    alt = math.degrees(math.asin(max(-1, min(1, sin_alt))))
    
    # Calculate azimuth
    cos_az = (math.sin(dec_rad) - math.sin(lat_rad) * math.sin(math.radians(alt))) / (math.cos(lat_rad) * math.cos(math.radians(alt)))
    cos_az = max(-1, min(1, cos_az))
    az = math.degrees(math.acos(cos_az))
    
    # Adjust azimuth based on hour angle
    if math.sin(HA_rad) > 0:
        az = 360 - az
    
    return az, alt

@app.post("/exoplanets")
def exoplanets_in_view(data: CameraData):
    """
    Takes camera position/orientation and returns visible exoplanets.
    """
    ra, dec = convert_to_radec(data.latitude, data.longitude, data.azimuth, data.altitude)
    planets = get_exoplanets_in_view(ra, dec, data.fov)

    # Calculate az/alt for each planet
    results = []
    for p in planets:
        planet_ra = p.get("ra")
        planet_dec = p.get("dec")
        
        # Convert planet's RA/Dec to Az/Alt for user's location
        if planet_ra is not None and planet_dec is not None:
            try:
                az, alt = radec_to_azalt(planet_ra, planet_dec, data.latitude, data.longitude)
            except:
                az, alt = None, None
        else:
            az, alt = None, None
        
        results.append({
            "name": p.get("pl_name"),
            "ra": planet_ra,
            "dec": planet_dec,
            "az": az,
            "alt": alt,
            "distance": p.get("st_dist") or p.get("sy_dist"),
            "radius": p.get("pl_radj") or p.get("pl_rade"),
            "mass": p.get("pl_bmassj") or p.get("pl_bmasse"),
        })

    return {
        "camera_ra": ra,
        "camera_dec": dec,
        "fov": data.fov,
        "count": len(results),
        "results": results
    }

@app.get("/")
def root():
    return {"message": "Exoplanet Scope API is running"}

@app.get("/exoplanet/info")
def get_exoplanet_data(name: str = Query(..., description="Name of the exoplanet")):
    """
    Returns detailed NASA data for the given exoplanet.
    """
    return get_exoplanet_info(name)