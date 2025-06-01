from flask import Flask, render_template, jsonify, request
from astroquery.mast import Observations
import os

app = Flask(__name__, static_folder='.', static_url_path='')

# Store fetched image URLs
image_cache = {}

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/api/search/<target>')
def search_target(target):
    try:
        # Check cache first
        if target in image_cache:
            return jsonify(image_cache[target])

        # Query both telescopes
        jwst_obs = Observations.query_criteria(target_name=target, obs_collection='JWST')
        hst_obs = Observations.query_criteria(target_name=target, obs_collection='HST')

        # Get products for both telescopes
        images = {
            'jwst': None,
            'hubble': None,
            'target_info': {
                'name': target,
                'type': 'Astronomical Object',
                'description': f'Observations of {target}'
            }
        }

        # Process JWST images
        if len(jwst_obs) > 0:
            products = Observations.get_product_list(jwst_obs[0])
            image_products = products[products['productType'] == 'image']
            if len(image_products) > 0:
                images['jwst'] = image_products[0]['dataURI']

        # Process Hubble images
        if len(hst_obs) > 0:
            products = Observations.get_product_list(hst_obs[0])
            image_products = products[products['productType'] == 'image']
            if len(image_products) > 0:
                images['hubble'] = image_products[0]['dataURI']

        # Cache the results
        image_cache[target] = images
        return jsonify(images)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)