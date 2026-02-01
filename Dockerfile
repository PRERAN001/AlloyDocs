FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y \
    libreoffice \
    ffmpeg \
    poppler-utils \
    ghostscript \
    fonts-dejavu \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

ENV SOFFICE_PATH=soffice
ENV CUDA_VISIBLE_DEVICES=""
ENV OMP_NUM_THREADS=1

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 10000

CMD gunicorn app2:app --bind 0.0.0.0:$PORT --workers 1 --threads 2
