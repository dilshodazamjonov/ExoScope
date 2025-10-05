import json
import os
from utils.calculations import is_within_scope
from functools import lru_cache

# Path to your saved dataset file
DATA_PATH = "D:\\python projects\\python\\NasaSpaceApps\\exoplanet_scope_backend\\backend_django\\exoplanet_scope_backend\\api\\services\\data\\exoplanets_full.json"
@lru_cache(maxsize=1)
def load_exoplanet_catalog():
    """
    Load all exoplanet data from local JSON file (cached for performance).
    """
    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(
            f"Exoplanet data file not found at {DATA_PATH}. "
            "Please download it first using the data fetch script."
        )

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data


def get_all_exoplanets():
    """
    Return all exoplanets from the locally cached catalog.
    """
    return load_exoplanet_catalog()


def get_exoplanets_in_view(ra, dec, fov):
    """
    Returns all exoplanets within the camera’s field of view.
    """
    exoplanets = get_all_exoplanets()
    return [
        planet for planet in exoplanets
        if "ra" in planet and "dec" in planet and
           is_within_scope(ra, dec, planet["ra"], planet["dec"], fov)
    ]


def get_exoplanet_info(name: str):
    """
    Fetch detailed information about a specific exoplanet
    from the locally stored dataset.
    """
    exoplanets = get_all_exoplanets()
    matches = [p for p in exoplanets if p.get("pl_name", "").lower() == name.lower()]

    if not matches:
        return {"error": f"No data found for {name}"}

    planet = matches[0]

    return {
        "name": planet.get("pl_name"),
        "hostname": planet.get("hostname"),
        "discovery_method": planet.get("discoverymethod"),
        "discovery_year": planet.get("disc_year"),
        "orbital_period_days": planet.get("pl_orbper"),
        "radius_jupiter": planet.get("pl_radj") or planet.get("pl_rade"),
        "mass_jupiter": planet.get("pl_bmassj") or planet.get("pl_bmasse"),
        "equilibrium_temperature": planet.get("pl_eqt"),
        "stellar_distance_ly": planet.get("st_dist") or planet.get("sy_dist"),
        "stellar_temp": planet.get("st_teff"),
        "stellar_mass": planet.get("st_mass"),
        "stellar_radius": planet.get("st_rad"),
        "updated": planet.get("rowupdate")
    }
