from flask import Flask, request, jsonify, send_from_directory
from bestselect import get_best_observation
from astroquery.mast import Observations
import os

app = Flask(__name__, static_folder='.')

# Serve static files from root directory
@app.route('/')
def serve_home():
    return send_from_directory('.', 'home.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/search/<target>')
def search_target(target):
    try:
        jwst = get_best_observation("JWST")
        hst = get_best_observation("HST")

        def get_preview_url(obs_id):
            try:
                products = Observations.get_product_list(obs_id)
                image_products = products[[fn.endswith(('.fits', '.jpg', '.jpeg', '.png')) 
                                        for fn in products['productFilename']]]
                if len(image_products) > 0:
                    return image_products[0]['dataURI']
            except Exception:
                return None
            return None

        return jsonify({
            'jwst': get_preview_url(jwst[0]) if jwst else None,
            'hubble': get_preview_url(hst[0]) if hst else None,
            'target_info': {
                'name': target,
                'type': 'Astronomical Object',
                'description': f'Observations of {target}'
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)