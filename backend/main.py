from fastapi import FastAPI, Query
from pydantic import BaseModel
from services.coordinates import convert_to_radec
from services.nasa_api import get_exoplanets_in_view, get_exoplanet_info

app = FastAPI(title="Exoplanet Scope API")

class CameraData(BaseModel):
    latitude: float
    longitude: float
    azimuth: float
    altitude: float
    fov: float = 5.0  # degrees

@app.post("/exoplanets")
def exoplanets_in_view(data: CameraData):
    """
    Takes camera position/orientation and returns visible exoplanets.
    """
    ra, dec = convert_to_radec(data.latitude, data.longitude, data.azimuth, data.altitude)
    planets = get_exoplanets_in_view(ra, dec, data.fov)

    return {
        "camera_ra": ra,
        "camera_dec": dec,
        "fov": data.fov,
        "count": len(planets),
        "results": [
            {"name": p["pl_name"], "ra": p["ra"], "dec": p["dec"], "distance": p["st_dist"]}
            for p in planets
        ]
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


