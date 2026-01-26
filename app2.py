import os
import subprocess
import zipfile
from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import secrets
from PyPDF2 import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4

from PIL import Image
from rembg import remove

from moviepy import (
    VideoFileClip,
    AudioFileClip,
    concatenate_videoclips
)

from pydub import AudioSegment
import pandas as pd


SOFFICE = r"C:\Program Files\LibreOffice\program\soffice.exe"
INPUT_DIR = "input"
OUTPUT_DIR = "output"

os.makedirs(INPUT_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

app = Flask(__name__)
CORS(app)


def save_file(file):
    filename = secure_filename(file.filename)
    path = os.path.join(INPUT_DIR, filename)
    file.save(path)
    return path, filename

@app.route("/generate_apikey", methods=["POST"])
def generate_apikey():
    return jsonify({"api_key": "ryzi7"+secrets.token_hex(16)})

@app.route("/pdf/convert_word", methods=["POST"])
def pdf_to_word():
    file = request.files["file"]
    path, name = save_file(file)

    subprocess.run([
        SOFFICE, "--headless",
        "--convert-to", "docx",
        path, "--outdir", OUTPUT_DIR
    ], check=True)

    out = os.path.join(OUTPUT_DIR, name.replace(".pdf", ".docx"))
    return send_file(out, as_attachment=True)


@app.route("/word/convert_pdf", methods=["POST"])
def word_to_pdf():
    file = request.files["file"]
    path, name = save_file(file)

    subprocess.run([
        SOFFICE, "--headless",
        "--convert-to", "pdf",
        path, "--outdir", OUTPUT_DIR
    ], check=True)

    out = os.path.join(OUTPUT_DIR, name.rsplit(".", 1)[0] + ".pdf")
    return send_file(out, as_attachment=True)


@app.route("/pdf/merge", methods=["POST"])
def merge_pdf():
    files = request.files.getlist("files")
    writer = PdfWriter()

    for f in files:
        path, _ = save_file(f)
        reader = PdfReader(path)
        for p in reader.pages:
            writer.add_page(p)

    out = os.path.join(OUTPUT_DIR, "merged.pdf")
    with open(out, "wb") as fp:
        writer.write(fp)

    return send_file(out, as_attachment=True)


@app.route("/pdf/split", methods=["POST"])
def split_pdf():
    file = request.files["file"]
    start = int(request.form["start"]) - 1
    end = int(request.form["end"])

    path, name = save_file(file)
    reader = PdfReader(path)
    writer = PdfWriter()

    for p in reader.pages[start:end]:
        writer.add_page(p)

    out = os.path.join(OUTPUT_DIR, name.replace(".pdf", "_split.pdf"))
    with open(out, "wb") as fp:
        writer.write(fp)

    return send_file(out, as_attachment=True)


@app.route("/pdf/watermark", methods=["POST"])
def watermark_pdf():
    file = request.files["file"]
    text = request.form["text"]

    wm_path = os.path.join(OUTPUT_DIR, "wm.pdf")
    c = canvas.Canvas(wm_path, pagesize=A4)
    c.setFont("Helvetica-Bold", 40)
    c.setFillAlpha(0.2)
    c.rotate(45)
    c.drawCentredString(300, 200, text)
    c.save()

    path, name = save_file(file)
    reader = PdfReader(path)
    watermark = PdfReader(wm_path).pages[0]

    writer = PdfWriter()
    for page in reader.pages:
        page.merge_page(watermark)
        writer.add_page(page)

    out = os.path.join(OUTPUT_DIR, name.replace(".pdf", "_wm.pdf"))
    with open(out, "wb") as fp:
        writer.write(fp)

    return send_file(out, as_attachment=True)



@app.route("/image/remove_bg", methods=["POST"])
def remove_bg():
    file = request.files["file"]
    path, name = save_file(file)

    img = Image.open(path)
    result = remove(img)

    out = os.path.join(OUTPUT_DIR, name.rsplit(".", 1)[0] + "_nobg.png")
    result.save(out)

    return send_file(out, as_attachment=True)

@app.route("/image/logo_watermark", methods=["POST"])
def image_logo_watermark():
    file = request.files["file"]
    watermark = request.files["watermark"]
    scale = float(request.form.get("scale", 0.2))
    opacity = int(request.form.get("opacity", 180))

    base_path, base_name = save_file(file)
    wm_path, _ = save_file(watermark)

    base = Image.open(base_path).convert("RGBA")
    wm = Image.open(wm_path).convert("RGBA")

    
    wm_width = int(base.size[0] * scale)
    wm_height = int((wm_width / wm.size[0]) * wm.size[1])
    wm = wm.resize((wm_width, wm_height))

    
    wm.putalpha(opacity)

    
    position = (
        base.size[0] - wm.size[0] - 20,
        base.size[1] - wm.size[1] - 20
    )

    layer = Image.new("RGBA", base.size)
    layer.paste(wm, position, wm)

    final = Image.alpha_composite(base, layer)

    out = os.path.join(OUTPUT_DIR, "watermarked_" + base_name)
    final.convert("RGB").save(out)

    return send_file(out, as_attachment=True)


@app.route("/image/resize", methods=["POST"])
def resize_image():
    file = request.files["file"]
    width = int(request.form["width"])
    height = int(request.form["height"])

    path, name = save_file(file)
    img = Image.open(path).resize((width, height))

    out = os.path.join(OUTPUT_DIR, name)
    img.save(out)

    return send_file(out, as_attachment=True)



@app.route("/video/trim", methods=["POST"])
def trim_video():
    file = request.files["file"]
    start = float(request.form["start"])
    end = float(request.form["end"])

    path, name = save_file(file)
    clip = VideoFileClip(path).subclip(start, end)

    out = os.path.join(OUTPUT_DIR, "trimmed_" + name)
    clip.write_videofile(out)

    return send_file(out, as_attachment=True)


@app.route("/video/merge", methods=["POST"])
def merge_video():
    files = request.files.getlist("files")
    clips = []

    for f in files:
        path, _ = save_file(f)
        clips.append(VideoFileClip(path))

    final = concatenate_videoclips(clips)
    out = os.path.join(OUTPUT_DIR, "merged_video.mp4")
    final.write_videofile(out)

    return send_file(out, as_attachment=True)

@app.route("/video/extract_audio", methods=["POST"])
def extract_audio_from_video():
    file = request.files["file"]
    path, name = save_file(file)

    clip = VideoFileClip(path)

    out = os.path.join(
        OUTPUT_DIR,
        name.rsplit(".", 1)[0] + "_audio.mp3"
    )

    clip.audio.write_audiofile(out)

    return send_file(out, as_attachment=True)


@app.route("/video/add_audio", methods=["POST"])
def add_audio():
    video = request.files["video"]
    audio = request.files["audio"]

    vpath, vname = save_file(video)
    apath, _ = save_file(audio)

    vclip = VideoFileClip(vpath)
    aclip = AudioFileClip(apath)

    final = vclip.set_audio(aclip)
    out = os.path.join(OUTPUT_DIR, "audio_" + vname)
    final.write_videofile(out)

    return send_file(out, as_attachment=True)


@app.route("/audio/convert", methods=["POST"])
def convert_audio():
    file = request.files["file"]
    fmt = request.form["format"]

    path, name = save_file(file)
    audio = AudioSegment.from_file(path)

    out = os.path.join(OUTPUT_DIR, name.rsplit(".", 1)[0] + f".{fmt}")
    audio.export(out, format=fmt)

    return send_file(out, as_attachment=True)


@app.route("/audio/trim", methods=["POST"])
def trim_audio():
    file = request.files["file"]
    start = int(float(request.form["start"]) * 1000)
    end = int(float(request.form["end"]) * 1000)

    path, name = save_file(file)
    audio = AudioSegment.from_file(path)[start:end]

    out = os.path.join(OUTPUT_DIR, "trim_" + name)
    audio.export(out, format=name.rsplit(".", 1)[1])

    return send_file(out, as_attachment=True)



@app.route("/excel/to_csv", methods=["POST"])
def excel_to_csv():
    file = request.files["file"]
    sheet = request.form.get("sheet", 0)

    path, name = save_file(file)
    df = pd.read_excel(path, sheet_name=sheet)

    out = os.path.join(OUTPUT_DIR, name.replace(".xlsx", ".csv"))
    df.to_csv(out, index=False)

    return send_file(out, as_attachment=True)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
