from math import radians, cos, sin, acos

def angular_distance(ra1, dec1, ra2, dec2):
    """Calculate angular distance between two sky coordinates (degrees)."""
    ra1, dec1, ra2, dec2 = map(radians, [ra1, dec1, ra2, dec2])
    return acos(sin(dec1)*sin(dec2) + cos(dec1)*cos(dec2)*cos(ra1 - ra2)) * (180 / 3.14159)

def is_within_scope(camera_ra, camera_dec, planet_ra, planet_dec, fov):
    """Check if the planet is within the camera's field of view."""
    return angular_distance(camera_ra, camera_dec, planet_ra, planet_dec) <= fov
