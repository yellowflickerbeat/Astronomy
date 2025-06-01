from astroquery.mast import Observations
from astropy.time import Time
import sqlite3

def jd_to_iso(jd):
    try:
        return Time(jd, format='jd').to_value('iso', subfmt='date')
    except Exception:
        return None

def fetch_and_store(object_name):
    # Query observations
    obs_table = Observations.query_object(object_name)

    # Filter to HST and JWST only
    obs_table = obs_table[(obs_table['obs_collection'] == 'HST') | (obs_table['obs_collection'] == 'JWST')]
    print(f"Found {len(obs_table)} observations for {object_name}.")

    # Connect to SQLite database
    conn = sqlite3.connect('observations11.db')
    c = conn.cursor()

    # Create table with extended metadata
    c.execute('''
        CREATE TABLE IF NOT EXISTS metadata (
            obs_id TEXT PRIMARY KEY,
            object TEXT,
            telescope TEXT,
            instrument TEXT,
            target_name TEXT,
            obs_date TEXT,
            exposure_time REAL,
            release_date TEXT
        )
    ''')

    count = 0
    for row in obs_table:
        try:
            obs_date = jd_to_iso(row.get('t_min'))
            release_date = jd_to_iso(row.get('t_obs_release'))
            exposure_time = float(row.get('t_exptime')) if row.get('t_exptime') else None

            c.execute('''
                INSERT OR REPLACE INTO metadata
                (obs_id, object, telescope, instrument, target_name, obs_date, exposure_time, release_date)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                row['obsid'],
                object_name,
                row['obs_collection'],
                row['instrument_name'],
                row['target_name'],
                obs_date,
                exposure_time,
                release_date
            ))
            count += 1
        except Exception as e:
            print(f"Error saving entry for obs_id {row.get('obsid')}: {e}")

    conn.commit()
    conn.close()
    print(f"Stored {count} entries for {object_name}.")

if __name__ == '__main__':
    fetch_and_store("NGC 3132")  # You can change this to test with other objects
