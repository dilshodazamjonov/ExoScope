from astropy.coordinates import EarthLocation, AltAz, SkyCoord
from astropy.time import Time
import astropy.units as u

def convert_to_radec(lat, lon, azimuth, altitude):
    """
    Convert local sky coordinates (Azimuth, Altitude) to 
    celestial coordinates (Right Ascension, Declination).
    """
    location = EarthLocation(lat=lat * u.degree, lon=lon * u.degree) # type: ignore
    time = Time.now()

    altaz = AltAz(az=azimuth * u.degree, alt=altitude * u.degree, location=location, obstime=time) # type: ignore
    sky_coord = SkyCoord(altaz)

    ra = sky_coord.icrs.ra.degree # type: ignore
    dec = sky_coord.icrs.dec.degree # type: ignore
    return ra, dec
