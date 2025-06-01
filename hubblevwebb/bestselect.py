from astroquery.mast import Observations
import sqlite3

def get_best_observation(telescope):
    conn = sqlite3.connect('observations11.db')
    c = conn.cursor()

    # Updated column names to match your table: exposure_time and release_date
    c.execute('''
        SELECT * FROM metadata
        WHERE telescope = ? AND exposure_time IS NOT NULL
        ORDER BY exposure_time DESC, release_date DESC
    ''', (telescope,))

    for row in c.fetchall():
        obs_id = row[0]
        try:
            products = Observations.get_product_list(obs_id)
            image_products = products[[fn.endswith(('.fits', '.jpg', '.jpeg', '.png')) for fn in products['productFilename']]]
            if len(image_products) > 0:
                conn.close()
                return row  # Return the first row with downloadable images
        except Exception as e:
            print(f"Skipping obs_id {obs_id}: {e}")
            continue

    conn.close()
    return None

if __name__ == '__main__':
    jwst_best = get_best_observation("JWST")
    hst_best = get_best_observation("HST")

    print("Best JWST observation:")
    print(jwst_best)

    print("\nBest HST observation:")
    print(hst_best)
