from astroquery.mast import Observations
import sqlite3

def get_best_observation(telescope, target=None):
    conn = sqlite3.connect('observations11.db')
    c = conn.cursor()

    query = '''
        SELECT * FROM metadata 
        WHERE telescope = ? AND exposure_time IS NOT NULL
        ORDER BY exposure_time DESC, release_date DESC
    '''
    params = [telescope]

    if target:
        query = query.replace('WHERE', 'WHERE object = ? AND')
        params.insert(0, target)

    c.execute(query, params)

    for row in c.fetchall():
        obs_id = row[0]
        try:
            products = Observations.get_product_list(obs_id)
            image_products = products[[fn.endswith(('.fits', '.jpg', '.jpeg', '.png')) 
                                    for fn in products['productFilename']]]
            if len(image_products) > 0:
                conn.close()
                return row
        except Exception as e:
            print(f"Skipping obs_id {obs_id}: {e}")
            continue

    conn.close()
    return None