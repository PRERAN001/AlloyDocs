

# AlloyDocs

AlloyDocs is a full-stack **document and media processing platform** designed to be used both via a web interface and as a **developer-facing API service**.

It provides tools for **PDF, Word, Image, Video, Audio, and Excel processing**, backed by a secure **API key and token-based usage system**, similar to commercial API platforms.

---

## Live Deployment

**Frontend (Vercel):**
[https://alloy-docs-tms2.vercel.app/](https://alloy-docs-tms2.vercel.app/)

The frontend connects to the Node.js backend, which securely proxies requests to the Python processing service.

---

## API Key & Token System

AlloyDocs uses an **API key with token quotas**.

### API Key

* API keys can be generated from the frontend.
* Each request to the backend must include a valid API key.
* API keys are validated and managed by the **Node.js backend**.

### Default Token Allocation

* Every new API key starts with **1000 tokens**
* Tokens are consumed per operation

### Token Cost

* Each standard operation costs **5 tokens**
* More expensive operations (large PDFs, videos) may consume more tokens in the future

If tokens are exhausted:

* Requests are rejected
* A new API key must be generated or upgraded (future feature)

### Example API Header

```http
x-api-key: ryzi7xxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Architecture Overview

AlloyDocs follows a **gateway–worker architecture**.

### Node.js (API Gateway)

The Node.js backend is responsible for:

* API key generation and validation
* Token tracking and deduction
* Authentication and authorization
* Rate limiting and request validation
* CORS and security controls
* Proxying requests to the Python service

### Python (Processing Engine)

The Python service is responsible for:

* Heavy document and media processing
* PDF, Word, Excel transformations
* Image background removal and resizing
* Video trimming, merging, and audio extraction
* Audio conversion and trimming

Request flow:

```
Frontend → Node.js → Python → Node.js → Frontend
```

Python services are not exposed publicly; all access is controlled by Node.js.

---

## Features

### Frontend

* Built with Vite and React
* API key generation and management UI
* File upload and processing interface
* Preview support for PDFs, images, audio, and video

### Backend (Node.js)

* Express-based REST API
* API key middleware
* Token-based usage enforcement
* Secure request forwarding to Python

### Backend (Python)

* Flask-based processing service
* Supports:

  * PDF merge, split, watermark, convert
  * Word to PDF and PDF to Word
  * Image resize, watermark, background removal
  * Video trim, merge, extract audio
  * Audio convert and trim
  * Excel to CSV

### Docker Support

* Python service is containerized
* Production-ready deployment using Gunicorn

---

## Project Structure

```
AlloyDocs/
├── backend/              Node.js API gateway
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   └── server.js
│
├── frontend/             Vite + React frontend
│   └── src/
│
├── app2.py               Python processing service
├── requirements.txt      Python dependencies
├── Dockerfile            Python service container
├── input/                Temporary input files
└── output/               Generated output files
```

---

## Prerequisites

* Node.js 16+
* npm or yarn
* Python 3.8+
* Docker (optional)

---

## Local Development Setup

### Backend (Node.js)

```bash
cd backend
npm install
npm run dev
```

---

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

### Python Service

```bash
pip install -r requirements.txt
python app2.py
```

The Python service is accessed internally by the Node.js backend.

---

## Docker (Python Service)

```bash
docker build -t alloydocs-python .
docker run -p 5000:5000 alloydocs-python
```

In production, the Python service runs using Gunicorn, not the Flask development server.

---

## Environment Configuration

### Backend (Node.js)

* `PORT` (assigned automatically by hosting provider)
* `PYTHON_BACKEND_URL`
* Database configuration (MongoDB)
* Firebase credentials (if enabled)

### Frontend

* Uses `VITE_*` environment variables
* Firebase configuration in `frontend/src/firebase.js`

---

## Security

* API keys are validated on every request
* Token usage is tracked per key
* Python service is not publicly exposed
* CORS is restricted to trusted frontend domains

---

## Key Files

* `backend/server.js`
* `backend/routes/user.routes.js`
* `backend/controllers/user.controller.js`
* `backend/middleware/apiKeyAuth.js`
* `frontend/src/main.jsx`
* `frontend/src/firebase.js`
* `app2.py`
* `Dockerfile`
* `requirements.txt`

---

## Example API Flow

```
1. Client sends request with API key
2. Node.js validates key and available tokens
3. Tokens are deducted
4. Request is forwarded to Python service
5. Python processes the file
6. Result is streamed back to the client
```

---

## Contributing

* Fork the repository
* Create a feature branch
* Submit a pull request with a clear description and test steps

---

## License

MIT-style license.
(Add a LICENSE file if you want to formalize it.)

---



Just tell me what you want to build next.
