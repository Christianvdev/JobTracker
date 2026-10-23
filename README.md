# JobTracker

A full-stack job application tracker built with Django and React. Log jobs you've applied to, track their status, and use the AI parsing feature to auto-fill application details from a raw job posting.

---
<img width="946" height="356" alt="Screenshot 2026-07-06 235126" src="https://github.com/user-attachments/assets/038b0912-b93d-434e-9f62-3c36e8b293bb" />
<img width="994" height="599" alt="Screenshot 2026-07-06 235118" src="https://github.com/user-attachments/assets/ba0c8e05-dcae-41bf-8400-b192ca1745a5" />

## Features

- **JWT Authentication** — register, log in, and stay logged in with automatic token refresh
- **Full CRUD** — add, view, edit, and delete job applications
- **Status Tracking** — track each application through Applied, Interviewing, Offer Received, Hired, and more
- **Expandable Notes** — keep notes per application, toggled on demand
- **AI Job Parsing** — paste a raw job description and auto-fill the form using LLaMA 3.3 via Groq

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Python, Django, Django REST Framework |
| Auth | SimpleJWT |
| AI | Groq API (LLaMA 3.3) |
| Frontend | React, Vite, Axios |

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Christianvdev/JobTracker.git
cd JobTracker
```

### 2. Backend setup

```bash
python -m pip install -r requirements.txt
```

Create a `.env` file in the `JobTracker/` directory:

```env
SECRET_KEY=your_django_secret_key
GROQ_API_KEY=your_groq_api_key
DEBUG=True
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

```bash
python manage.py migrate
python manage.py runserver
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://127.0.0.1:8000/
```

```bash
npm run dev
```

---

## Testing

Run the backend tests after installing dependencies and configuring `SECRET_KEY`:

```bash
python manage.py test
```

The test suite covers job ownership, authenticated access, and AI parsing failures using mocked provider responses. Tests do not require a live Groq API key.

The repository includes a backend `requirements.txt` and a GitHub Actions workflow that runs Django checks, tests, and the frontend production build on every push.

## How the AI Parsing Works

On the Add Job page, paste any raw job posting into the text area and click **Parse with AI**. The app sends the text to LLaMA 3.3 running on Groq's servers, which extracts the company name, role title, and requirements and automatically fills in the form. You can review and edit before saving.

---
