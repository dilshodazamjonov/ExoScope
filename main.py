import requests
import json

print("🌌 Fetching full NASA Exoplanet dataset...")

url = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"

# Get everything (no TOP limit)
query = """
SELECT pl_name, ra, dec, pl_rade, pl_bmasse, disc_facility, disc_year,
       hostname, st_teff, st_rad, st_mass, discoverymethod
FROM pscomppars
WHERE pl_name IS NOT NULL
"""

params = {
    "query": query,
    "format": "json"
}

try:
    # stream large data to prevent memory overflow
    with requests.post(url, data=params, stream=True, timeout=180) as response:
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Retrieved {len(data)} exoplanets.")
            
            # save to file
            with open("exoplanets_full.json", "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            
            print("💾 Saved full dataset to exoplanets_full.json")
        else:
            print(f"❌ Error {response.status_code}")
            print(response.text)
except requests.exceptions.Timeout:
    print("⚠️ Request timed out — dataset too large. Try using the async TAP service or limit columns.")
except Exception as e:
    print(f"⚠️ Error: {e}")
