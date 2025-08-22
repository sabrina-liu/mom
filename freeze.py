# freeze.py
from flask_frozen import Freezer
from app import app

# ensure 'PREFERRED_URL_SCHEME' if needed:
# app.config['PREFERRED_URL_SCHEME'] = 'https'

freezer = Freezer(app)

if __name__ == "__main__":
    freezer.freeze()  # outputs to ./build by default
