# build_static.py
from pathlib import Path
import os, shutil
from flask import Flask, render_template

ROOT = Path(__file__).parent
TEMPLATES = ROOT / "templates"
STATIC = ROOT / "static"
OUT = Path(os.environ.get("OUTPUT_DIR", "public"))  # CF Pages: set to "public"

app = Flask(__name__, template_folder=str(TEMPLATES), static_folder=str(STATIC))

# Try to reuse your data/constants from app.py; fall back to safe defaults
try:
    from app import (
        CAROUSEL, ACCOLADES_ZH, TESTIMONIALS_ZH,
        SCHOOL_NAME_ZH, TAGLINE_ZH, MOTTO_ZH
    )
except Exception:
    CAROUSEL = []
    ACCOLADES_ZH = []
    TESTIMONIALS_ZH = []
    SCHOOL_NAME_ZH = "秀林中文网上学校"
    TAGLINE_ZH = "中文·数学·英语·小班与一对一"
    MOTTO_ZH = "认真学，也要开开心心学。"

def write_html(path: Path, html: str):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(html, encoding="utf-8")

def render_page(template: str, **ctx) -> str:
    # Give Jinja a request + app context so url_for works
    with app.app_context(), app.test_request_context("/"):
        return render_template(template, **ctx)

def main():
    # Clean output
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True, exist_ok=True)

    # Copy /static
    shutil.copytree(STATIC, OUT / "static")

    common = dict(
        SCHOOL_NAME_ZH=SCHOOL_NAME_ZH,
        TAGLINE_ZH=TAGLINE_ZH,
        MOTTO_ZH=MOTTO_ZH,
    )

    # Home
    html = render_page(
        "index.html",
        active="home",
        carousel=CAROUSEL,
        ACCOLADES_ZH=ACCOLADES_ZH,
        TESTIMONIALS_ZH=TESTIMONIALS_ZH,
        **common
    )
    write_html(OUT / "index.html", html)

    # About
    html = render_page("about.html", active="about", **common)
    write_html(OUT / "about" / "index.html", html)

    # Gallery
    html = render_page("gallery.html", active="gallery", **common)
    write_html(OUT / "gallery" / "index.html", html)

    # Contact
    html = render_page("contact.html", active="contact", **common)
    write_html(OUT / "contact" / "index.html", html)

    print(f"Built to: {OUT.resolve()}")

if __name__ == "__main__":
    main()
