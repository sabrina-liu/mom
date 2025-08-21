# build_static.py
from pathlib import Path
from shutil import rmtree, copytree
from app import app  # must expose "app = Flask(__name__)" and your routes

OUT = Path("build")

# Routes to pre-render → output file
ROUTES = [
    ("/",            "index.html"),
    ("/about/",      "about/index.html"),
    ("/gallery/",    "gallery/index.html"),
    ("/contact/",    "contact/index.html"),
]

def write_text(path: Path, text: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")

if __name__ == "__main__":
    # clean output folder
    if OUT.exists():
        rmtree(OUT)

    # render each route under a real request context
    with app.test_client() as client:
        for url, outfile in ROUTES:
            resp = client.get(url)
            if resp.status_code != 200:
                raise RuntimeError(f"GET {url} → {resp.status_code}")
            html = resp.get_data(as_text=True)
            write_text(OUT / outfile, html)
            print(f"✓ {url} -> build/{outfile}")

    # copy static assets
    copytree("static", OUT / "static")
    print("✅ Build complete → ./build")
