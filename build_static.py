# build_static.py
from pathlib import Path
from shutil import rmtree, copytree
from app import app

# Import your real view functions so we render with the same context/data
# Make sure these names match your routes in app.py
from app import home, about, gallery, contact

OUT = Path("build")

def write_html(path: Path, html: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")

if __name__ == "__main__":
    # clean output
    if OUT.exists():
        rmtree(OUT)

    # render pages using your existing view functions
    with app.app_context():
        write_html(OUT / "index.html",        home())
        write_html(OUT / "about" / "index.html",   about())
        write_html(OUT / "gallery" / "index.html", gallery())
        write_html(OUT / "contact" / "index.html", contact())

    # copy static assets (CSS/JS/images/fonts…)
    copytree("static", OUT / "static")
    print("✅ Built to ./build")
