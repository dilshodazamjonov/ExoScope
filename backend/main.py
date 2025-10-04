from fastapi import FastAPI
from pydantic import BaseModel
from services.coordinates import convert_to_radec
from services.nasa_api import get_exoplanets_in_view

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
        "results": planets
    }

@app.get("/")
def root():
    return {"message": "Exoplanet Scope API is running"}
