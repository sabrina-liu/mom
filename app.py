from flask import Flask, render_template, url_for

app = Flask(__name__)
app.secret_key = "change-me"

SCHOOL_NAME_ZH = "秀林中文学校"
TAGLINE_ZH = "中文 · 数学 · 英语 · 电脑 —— 扎实、亲切、有效"

CAROUSEL = [
    {"file": "pic1.jpg", "alt": "课堂剪影"},
    {"file": "pic2.jpg", "alt": "拼音与认字"},
    {"file": "pic3.jpg", "alt": "数学辅导"},
    {"file": "pic4.jpg", "alt": "作文比赛获奖"},
    {"file": "pic5.jpg", "alt": "线上课堂 Zoom"},
]

ACCOLADES_ZH = [
    "多年一线教学，专注中文与数学分层教学",
    "考试方向明确：HSK、IB、IGCSE、A-Level",
    "班级听写通过率 100%，平均成绩 90 分以上",
    "注重习惯培养：听写、朗读、复述与写作并进"
]

TESTIMONIALS_ZH = [
    {"name": "Bobby 家长", "text": "跟林老师学了一年，Bobby 现在是学校数学第一名。"},
    {"name": "Mei", "text": "从零基础开始，10 个月通过 HSK4，阅读写作明显进步。"},
    {"name": "Arjun 家长", "text": "孩子自信大增——结构清晰、循循善诱、方法到位。"},
]

MOTTO_ZH = "小朋友快坐好！林老师要开始上网课啦！"

ASSISTANTS = [
    {
        "name": "刘老师（女儿）",
        "desc": "海外名校在读/毕业，英文与中文俱佳，擅长写作与口语表达训练。",
        "avatar": "assistant1.jpg",
        "char": "character1.png"
    },
    {
        "name": "林老师（儿子）",
        "desc": "海外大学理工科背景，擅长数学与编程启蒙，授课耐心、逻辑严谨。",
        "avatar": "assistant2.jpg",
        "char": "character2.png"
    }
]

@app.context_processor
def inject_globals():
    return dict(
        SCHOOL_NAME_ZH=SCHOOL_NAME_ZH,
        TAGLINE_ZH=TAGLINE_ZH,
        ACCOLADES_ZH=ACCOLADES_ZH,
        TESTIMONIALS_ZH=TESTIMONIALS_ZH,
        MOTTO_ZH=MOTTO_ZH,
        ASSISTANTS=ASSISTANTS
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
