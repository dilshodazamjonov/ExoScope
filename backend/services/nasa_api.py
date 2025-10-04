import requests
from utils.calculations import is_within_scope

EXOPLANET_API = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"

def get_all_exoplanets():
    query = "select pl_name, ra, dec, pl_rade, pl_bmasse from pscomppars"
    response = requests.get(EXOPLANET_API, params={"query": query, "format": "json"})
    if response.status_code == 200:
        return response.json()
    return []

def get_exoplanets_in_view(ra, dec, fov):
    exoplanets = get_all_exoplanets()
    return [
        planet for planet in exoplanets
        if "ra" in planet and "dec" in planet and is_within_scope(ra, dec, planet["ra"], planet["dec"], fov)
    ]
