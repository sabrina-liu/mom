# freeze.py
from app import app
from flask_frozen import Freezer

# make asset/route URLs relative so they work on Pages
app.config['FREEZER_RELATIVE_URLS'] = True

freezer = Freezer(app)

if __name__ == '__main__':
    freezer.freeze()
