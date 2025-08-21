from flask import Flask, render_template, url_for

app = Flask(__name__)
app.secret_key = "xiaobudian"

SCHOOL_NAME_ZH = "林老师"
TAGLINE_ZH = "中文 · 数学 · 英语 · 网课 · 团体课 · 一对一"

CAROUSEL = [
    {"file": "64a3a280fb09f48fb03ee2cfb325c461.jpg", "alt": "课堂剪影"},
    {"file": "profile.JPG", "alt": "拼音与认字"},
    {"file": "39e9a3d3daa2195c0f9bf47f53d38f66.jpg", "alt": "数学辅导"},
    {"file": "023e52a1e9e17e200ea5d0aaeb46ee82.jpg", "alt": "作文比赛获奖"},
    {"file": "IMG_0222.jpg", "alt": "线上课堂 Zoom"},
]

ACCOLADES_ZH = [
    "多年一线教学，专注中文与数学分层教学",
    "考试方向明确：HSK、IB、IGCSE、A-Level",
    "班级听写通过率 100%，平均成绩 90 分以上",
    "注重习惯培养：听写、朗读、复述与写作并进"
]

TESTIMONIALS_ZH = [
    {"name": "Bobby 家长, 约堡", "text": "跟林老师学了一年，Bobby 现在是学校数学第一名。"},
    {"name": "Mei，哈拉雷 ", "text": "从零基础开始，10 个月通过 HSK4，阅读写作明显进步。"},
    {"name": "Arjun 家长，开普敦", "text": "孩子自信大增——结构清晰、循循善诱、方法到位。"},
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
    return render_template("index.html", carousel=CAROUSEL)

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/gallery")
def gallery():
    import os
    files = [f for f in os.listdir("static/images") if f.lower().endswith((".jpg",".jpeg",".png",".webp",".gif")) and f not in ("wechat_qr.png",)]
    files.sort()
    if not files:
        files = [c["file"] for c in CAROUSEL]
    return render_template("gallery.html", files=files)

@app.route("/contact")
def contact():
    return render_template("contact.html")

if __name__ == "__main__":
    app.run(debug=True)
