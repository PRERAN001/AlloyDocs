FROM python:3.11-slim

# Avoid prompts
ENV DEBIAN_FRONTEND=noninteractive

# 🔥 System dependencies
RUN apt-get update && apt-get install -y \
    libreoffice \
    ffmpeg \
    poppler-utils \
    ghostscript \
    fonts-dejavu \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 🔥 Environment fixes
ENV SOFFICE_PATH=soffice
ENV CUDA_VISIBLE_DEVICES=""
ENV OMP_NUM_THREADS=1

# Working directory
WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install python deps
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Expose Flask port
EXPOSE 5000

# Run server
CMD ["python", "app.py"]
