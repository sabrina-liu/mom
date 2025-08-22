from flask import Flask, render_template, url_for

app = Flask(__name__)
app.secret_key = "xiaobudian"

SCHOOL_NAME_ZH = "林老师"
TAGLINE_ZH = "中文 · 数学 · 英语 · 网课 · 团体课 · 一对一"

CAROUSEL = [
    {"file": "64a3a280fb09f48fb03ee2cfb325c461.jpg", "alt": "课堂剪影"},
    {"file": "sab.jpg", "alt": "Sabrina老师"},
    {"file": "39e9a3d3daa2195c0f9bf47f53d38f66.jpg", "alt": "线上课堂"},
    {"file": "023e52a1e9e17e200ea5d0aaeb46ee82.jpg", "alt": "英语课"},
    {"file": "IMG_0222.jpg", "alt": "林老师家人"},
    {"file": "seb.jpg", "alt": "Sebastian老师"},

]

ACCOLADES_ZH = [
    "十年以上的教课经验",
    "深受学生和家长的喜爱",
    "所有孩子都欢迎",
    "网课时间方便"
]

TESTIMONIALS_ZH = [
    {"name": "Bobby家长, 约堡", "text": "跟林老师学了一年，Bobby 现在是学校数学第一名。"},
    {"name": "彬彬，哈拉雷 ", "text": "林老师又好笑又凶，我超喜欢她！"},
    {"name": "安安家长，开普敦", "text": "孩子自信大增——结构清晰、循循善诱、方法到位。"},
]


@app.context_processor
def inject_globals():
    return dict(
        SCHOOL_NAME_ZH=SCHOOL_NAME_ZH,
        TAGLINE_ZH=TAGLINE_ZH,
        ACCOLADES_ZH=ACCOLADES_ZH,
        TESTIMONIALS_ZH=TESTIMONIALS_ZH,
    )

@app.route("/")
def home():
    return render_template("index.html", current_page="home", carousel=CAROUSEL)

@app.route("/about/")
def about():
    return render_template("about.html", current_page="about")

@app.route("/gallery/")
def gallery():
    import os
    files = [f for f in os.listdir("static/images") if f.lower().endswith((".jpg",".jpeg",".png",".webp",".gif")) and f not in ("wechat_qr.png",)]
    files.sort()
    if not files:
        files = [c["file"] for c in CAROUSEL]
    return render_template("gallery.html", current_page="gallery", files=files)

@app.route("/contact/")
def contact():
    return render_template("contact.html", current_page="contact")

if __name__ == "__main__":
    app.run(debug=True)
