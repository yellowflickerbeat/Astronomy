# app.py
from flask import Flask, request, jsonify
from bestselect import get_best_observation
from astroquery.mast import Observations
import os

app = Flask(__name__)


@app.route('/get_images', methods=['GET'])
def get_images():
    object_name = request.args.get('object')

    jwst = get_best_observation("JWST", object_name)  # pass object_name if needed
    hst = get_best_observation("HST", object_name)

    def get_preview_url(obs_id):
        try:
            products = Observations.get_product_list(obs_id)
            filtered = Observations.filter_products(products, productType="SCIENCE")
            images = filtered[[fn.endswith(('.jpg', '.jpeg', '.png')) for fn in filtered['productFilename']]]
            if len(images) > 0:
                return images[0]['dataURI']  # MAST preview
        except:
            return None
        return None

    return jsonify({
        "jwst": {
            "obs_id": jwst[0],
            "image_url": get_preview_url(jwst[0])
        },
        "hst": {
            "obs_id": hst[0],
            "image_url": get_preview_url(hst[0])
        }
    })

if __name__ == "__main__":
    app.run(debug=True)
