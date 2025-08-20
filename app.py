from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "change-me"  # for flash messages

# ---- Site configuration you can tweak ----
SCHOOL_NAME_EN = "Xianglin Chinese School"
SCHOOL_NAME_CN = "香林中文学校"
TAGLINE = "Chinese & Maths tutoring — rigorous, friendly, effective."

# Carousel images: list file paths under /static (resolved via url_for in templates)
CAROUSEL = [
    {"file": "images/teacher.jpg", "alt": "Teacher and school artwork"},
    {"file": "images/teacher.jpg", "alt": "Learning Chinese characters"},
    {"file": "images/teacher.jpg", "alt": "Maths practice with guidance"},
]

ACCOLADES = [
    "Cambridge-certified Chinese teaching (TCFL)",
    "MSc-qualified educator with 8+ years' experience",
    "Former top 1% national maths cohort",
    "Specialist in exam preparation (IB, IGCSE, A-level, HSK)"
]

TESTIMONIALS = [
    {"name": "Bobby", "text": "Bobby studied for one year and is now number 1 in maths at his school."},
    {"name": "Mei", "text": "Started as a beginner; passed HSK 4 comfortably in 10 months."},
    {"name": "Arjun", "text": "Our son’s confidence soared — structured, calm, and methodical teaching."}
]


@app.context_processor
def inject_globals():
    return dict(
        SCHOOL_NAME_EN=SCHOOL_NAME_EN,
        SCHOOL_NAME_CN=SCHOOL_NAME_CN,
        TAGLINE=TAGLINE,
        ACCOLADES=ACCOLADES,
        TESTIMONIALS=TESTIMONIALS,
    )


@app.route("/")
def home():
    return render_template("index.html", carousel=CAROUSEL)


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = request.form.get("name","").strip()
        email = request.form.get("email","").strip()
        message = request.form.get("message","").strip()
        if not name or not email or not message:
            flash("Please complete all fields before submitting.", "error")
            return redirect(url_for("contact"))
        # In production: send an email or store to a database.
        print("New enquiry:", {'name': name, 'email': email, 'message': message})
        flash("Thanks — your message has been received. We'll reply shortly.", "success")
        return redirect(url_for("contact"))
    return render_template("contact.html")


if __name__ == "__main__":
    app.run(debug=True)
