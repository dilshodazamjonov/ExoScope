from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from api.services.coordinates import convert_to_radec
from api.services.nasa_api import get_exoplanets_in_view, get_exoplanet_info
import json
import math
from datetime import datetime


def radec_to_azalt(ra, dec, latitude, longitude):
    now = datetime.utcnow()
    J2000 = datetime(2000, 1, 1, 12, 0, 0)
    days_since_j2000 = (now - J2000).total_seconds() / 86400.0
    LST = (100.46 + 0.985647 * days_since_j2000 + longitude +
           15 * (now.hour + now.minute / 60.0 + now.second / 3600.0)) % 360
    HA = (LST - ra) % 360
    if HA > 180:
        HA -= 360
    HA_rad = math.radians(HA)
    dec_rad = math.radians(dec)
    lat_rad = math.radians(latitude)
    sin_alt = math.sin(dec_rad) * math.sin(lat_rad) + math.cos(dec_rad) * math.cos(lat_rad) * math.cos(HA_rad)
    alt = math.degrees(math.asin(max(-1, min(1, sin_alt))))
    cos_az = (math.sin(dec_rad) - math.sin(lat_rad) * math.sin(math.radians(alt))) / (math.cos(lat_rad) * math.cos(math.radians(alt)))
    cos_az = max(-1, min(1, cos_az))
    az = math.degrees(math.acos(cos_az))
    if math.sin(HA_rad) > 0:
        az = 360 - az
    return az, alt


@csrf_exempt
@require_http_methods(["POST"])
def exoplanets_in_view(request):
    try:
        data = json.loads(request.body)
        latitude = data["latitude"]
        longitude = data["longitude"]
        azimuth = data["azimuth"]
        altitude = data["altitude"]
        fov = data.get("fov", 5.0)
    except Exception as e:
        return JsonResponse({"error": f"Invalid input: {e}"}, status=400)

    ra, dec = convert_to_radec(latitude, longitude, azimuth, altitude)
    planets = get_exoplanets_in_view(ra, dec, fov)

    results = []
    for p in planets:
        planet_ra = p.get("ra")
        planet_dec = p.get("dec")
        az, alt = (None, None)
        if planet_ra and planet_dec:
            az, alt = radec_to_azalt(planet_ra, planet_dec, latitude, longitude)
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

    return JsonResponse({
        "camera_ra": ra,
        "camera_dec": dec,
        "fov": fov,
        "count": len(results),
        "results": results,
    })


@require_http_methods(["GET"])
def get_exoplanet_data(request):
    name = request.GET.get("name")
    if not name:
        return JsonResponse({"error": "Missing parameter 'name'"}, status=400)
    return JsonResponse(get_exoplanet_info(name))
