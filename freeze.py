# freeze.py
from app import app
from flask_frozen import Freezer

# Pretty URLs & relative paths (adjust if you like)
app.config.update(
    FREEZER_RELATIVE_URLS=True,
    FREEZER_DESTINATION='build',
)

# --- Werkzeug>=3 compatibility: Map.charset was removed ---
if not hasattr(app.url_map, "charset"):
    app.url_map.charset = "utf-8"
# ----------------------------------------------------------

freezer = Freezer(app)

if __name__ == "__main__":
    freezer.freeze()
