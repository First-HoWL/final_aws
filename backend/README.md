# 🐍 Backend — Django REST API

Django REST Framework backend for the Noted anonymous confession wall.  
Connects to **PostgreSQL** (via Docker or local). Handles auth, posts, likes, views, and auto-moderation.

---

## 📁 Structure

```
backend/
├── noted/
│   ├── settings.py     ← main configuration
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── app/
│   ├── models.py       ← Account, Note, Tag, NoteTags
│   ├── views.py        ← API endpoints
│   ├── serializers.py
│   ├── admin.py
│   └── migrations/
├── manage.py
├── requirements.txt
└── Dockerfile
```

---

## ⚡ Quick Start (without Docker)

### 1. Create and activate a virtual environment

**Windows (PowerShell):**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS / Linux:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Set the database mode

By default the backend connects to **PostgreSQL**.  
For local development without Docker, switch to SQLite:

**Windows (PowerShell):**
```powershell
$env:USE_SQLITE="True"
```

**macOS / Linux:**
```bash
export USE_SQLITE=True
```

### 4. Apply migrations

```bash
python manage.py migrate
```

### 5. (Optional) Create a superuser for Django Admin

```bash
python manage.py createsuperuser
```

### 6. Run the development server

```bash
python manage.py runserver
```

API will be available at: **http://44.197.2.29:8000/**  
Django admin panel: **http://44.197.2.29:8000/admin/**

---

## 🔧 Key Settings (`noted/settings.py`)

### Line 94 — Database switch

```python
# noted/settings.py, line ~94

USE_SQLITE = os.getenv("USE_SQLITE", "False") == "True"

if USE_SQLITE:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("POSTGRES_DB", "userdb"),
            "USER": os.getenv("POSTGRES_USER", "userdb"),
            "PASSWORD": os.getenv("POSTGRES_PASSWORD", "qwerty12345"),
            "HOST": os.getenv("POSTGRES_HOST", "db"),
            "PORT": os.getenv("POSTGRES_PORT", "5432"),
        }
    }
```

**To use SQLite locally** — set the environment variable `USE_SQLITE=True` (see step 3 above).  
**To use PostgreSQL** — leave the default and make sure a running Postgres instance is accessible, or use Docker Compose from the project root.

### CORS (line ~148)

```python
CORS_ALLOW_ALL_ORIGINS = True   # ← open for development

# For production, switch to:
# CORS_ALLOW_ALL_ORIGINS = False
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://<EC2_IP>",
# ]
```

---

## 📡 API Endpoints

| Method | URL | Description |
|---|---|---|
| `POST` | `/api/register/` | Register a new account |
| `POST` | `/api/login/` | Login |
| `GET` | `/api/notes/` | List all published confessions |
| `POST` | `/api/notes/` | Submit a new confession |
| `GET` | `/api/notes/<id>/` | Get a single confession (increments views) |
| `POST` | `/api/notes/<id>/like/` | Like a confession |
| `GET` | `/api/tags/` | List available tags |

---

## 🐳 Running via Docker Compose

From the project root:

```bash
docker compose up --build
```

The Django container automatically runs `python manage.py migrate` before starting.

---

## 📦 Dependencies (`requirements.txt`)

```
django
djangorestframework
psycopg2-binary
django-cors-headers
```

---

## 🗃️ Data Models

| Model | Fields |
|---|---|
| `Account` | `login`, `password`, `name` |
| `Note` | `title`, `text`, `isAnonymous`, `likes`, `views`, `status`, `date`, `account`, `tags` |
| `Tag` | `name` |
| `NoteTags` | junction table `Note ↔ Tag` |

### Note statuses

| Status | Meaning |
|---|---|
| `PENDING` | Just submitted, awaiting moderation |
| `PUBLISHED` | Passed moderation, visible on the wall |
| `REJECTED` | Flagged by auto-moderation, not shown |