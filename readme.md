# 📝 Noted — Anonymous Confession Wall

> A full-stack web application where users post short anonymous confessions without registration. Posts go through automatic moderation before publishing. Built with Django REST + React + PostgreSQL, deployed on AWS EC2 via Docker and GitHub Actions.

---

## 🏗️ Project Structure

```
final_aws/
├── backend/          # Django REST API + PostgreSQL
├── frontend/         # React SPA (CRA)
├── tg_bot/           # Telegram bot
├── docker-compose.yaml
└── .github/
    └── workflows/
        └── deploy.yaml   # CI/CD → AWS EC2
```

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 4+ · Django REST Framework · PostgreSQL |
| Frontend | React 19 · React Router · Axios |
| Database | PostgreSQL 16 (Docker container) |
| Bot | Telegram Bot API |
| Deploy | AWS EC2 · Docker · Docker Compose |
| CI/CD | GitHub Actions |

---

## 🔄 How It Works

1. User opens the site and submits a confession (title + text + optional tags).
2. The post is saved with status **PENDING**.
3. The backend automatically checks the text for forbidden words.
   - Clean → status becomes **PUBLISHED** (visible on the wall).
   - Flagged → status becomes **REJECTED** (not shown).
4. Published confessions show a **like counter** and a **view counter**.
5. The Telegram bot can also be used to submit and browse confessions.

### Post Lifecycle

```
[User submits] → PENDING → [Auto moderation] → PUBLISHED ✅
                                              ↘ REJECTED  ❌
```

---

## 🚀 Running the Full Stack (Docker Compose)

Requires: **Docker** and **Docker Compose** installed on the machine.

```bash
# Clone the repo
git clone https://github.com/<your-username>/<repo-name>.git
cd final_aws

# Start all services (DB + Backend + Frontend)
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend (React) | http://44.197.2.29 |
| Backend (Django API) | http://44.197.2.29:8000 |

To stop:
```bash
docker compose down
```

To stop and remove database data:
```bash
docker compose down -v
```

---

## 🌐 AWS EC2 Deployment

### Requirements on EC2 instance
- Ubuntu 22.04 (t2.micro or larger)
- Docker + Docker Compose installed
- Port **80** and **8000** open in Security Group

### Steps

```bash
# 1. SSH into the instance
ssh -i your-key.pem ubuntu@<EC2_PUBLIC_IP>

# 2. Install Docker
sudo apt update && sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker ubuntu
newgrp docker

# 3. Clone the repo
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>

# 4. Run
docker compose up --build -d
```

The site will be available at `http://<EC2_PUBLIC_IP>`.

---

## 🤖 CI/CD — GitHub Actions

The workflow at `.github/workflows/deploy.yaml` automatically deploys to EC2 on every push to `main`.

### Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions** and add:

| Secret | Description |
|---|---|
| `EC2_HOST` | Public IP of your EC2 instance |
| `EC2_USER` | SSH user (usually `ubuntu`) |
| `EC2_SSH_KEY` | Contents of your `.pem` private key |

On every push to `main`, the workflow:
1. SSHs into EC2
2. Pulls latest code
3. Runs `docker compose up --build -d`

---

## 🗄️ Database

PostgreSQL runs inside Docker. Credentials are set in `docker-compose.yaml`:

```
POSTGRES_USER=userdb
POSTGRES_PASSWORD=qwerty12345
POSTGRES_DB=userdb
```

Data is persisted in the `./db-data/` volume on the host machine.

---

## 📦 Services at a Glance

| Container | Port | Description |
|---|---|---|
| `db` | 5432 | PostgreSQL database |
| `django_app` | 8000 | Django REST API |
| `frontend` | 80 | React app served by Nginx |

---

## 📂 More Details

- [Backend README](./backend/README.md) — venv setup, running the server, settings
- [Frontend README](./frontend/README.md) — venv/npm setup, dev server, build