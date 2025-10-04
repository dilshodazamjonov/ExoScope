import requests
from utils.calculations import is_within_scope
from functools import lru_cache

EXOPLANET_API = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"

@lru_cache(maxsize=1)
def load_exoplanet_catalog():
    """Fetch all exoplanet data once and cache it."""
    url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"
    query = "select pl_name, ra, dec, pl_radj, pl_bmassj, st_dist from ps"
    params = {"query": query, "format": "json"}

    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

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

def get_exoplanet_info(name: str):
    """
    Fetch detailed information about a specific exoplanet from NASA Exoplanet Archive.
    """
    query = f"select * from ps where pl_name='{name}'"
    params = {
        "query": query,
        "format": "json"
    }

    response = requests.get(EXOPLANET_API, params=params)
    response.raise_for_status()

    data = response.json()
    if not data:
        return {"error": f"No data found for {name}"}

    planet = data[0]

    # You can choose what fields to keep
    return {
        "name": planet.get("pl_name"),
        "hostname": planet.get("hostname"),
        "discovery_method": planet.get("discoverymethod"),
        "discovery_year": planet.get("disc_year"),
        "orbital_period_days": planet.get("pl_orbper"),
        "radius_jupiter": planet.get("pl_radj"),
        "mass_jupiter": planet.get("pl_bmassj"),
        "equilibrium_temperature": planet.get("pl_eqt"),
        "stellar_distance_ly": planet.get("st_dist"),
        "stellar_temp": planet.get("st_teff"),
        "stellar_mass": planet.get("st_mass"),
        "stellar_radius": planet.get("st_rad"),
        "updated": planet.get("rowupdate")
    }
