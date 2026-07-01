# ⚛️ Frontend — React SPA

React single-page application for the Noted confession wall.  
Built with Create React App · React Router · Axios.  
In production, served as a static build via **Nginx** inside Docker.

---

## 📁 Structure

```
frontend/
├── noted/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js          ← all Axios API calls
│   │   ├── components/
│   │   │   ├── ConfessionCard/   ← single post card
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   ├── Layout/
│   │   │   └── TagBadge/
│   │   ├── pages/
│   │   │   ├── Home/             ← confession feed
│   │   │   ├── Submit/           ← submit a confession
│   │   │   ├── Confession/       ← single confession view
│   │   │   ├── Login/
│   │   │   ├── Register/
│   │   │   ├── Profile/
│   │   │   ├── Pending/          ← pending confessions (moderation)
│   │   │   ├── Support/
│   │   │   └── NotFound/
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   └── variables.css
│   │   ├── App.js
│   │   └── index.js
│   ├── .env                      ← API base URL config
│   ├── package.json
│   └── .gitignore
└── Dockerfile
```

---

## ⚡ Quick Start (without Docker)

### 1. Navigate to the app folder

```bash
cd frontend/noted
```

> **Note:** there is no Python venv here — the frontend uses **Node.js/npm** instead.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure the API URL

Open `frontend/noted/.env` and set the backend address.

The project uses a fixed EC2 IP — it's already set as the fallback in `src/api/index.js`:

```js
const BASE_URL = process.env.REACT_APP_API_URL || "http://44.197.2.29:8000"
```

So `.env` is only needed if you want to override it (e.g. for local dev):

```env
REACT_APP_API_URL=http://44.197.2.29:8000
```

For production on EC2 — leave `.env` empty or don't set this variable at all. The fallback IP `44.197.2.29:8000` will be used automatically.

### 4. Start the development server

```bash
npm start
```

The app opens automatically at: **http://localhost:3000**

---

## 🏗️ Build for Production

```bash
npm run build
```

This creates an optimized static bundle in `frontend/noted/build/`.  
In Docker, this build is copied into an **Nginx** image and served on port **80**.

---

## 🐳 Running via Docker Compose

From the project root (no manual npm needed):

```bash
docker compose up --build
```

The frontend will be available at **http://44.197.2.29** (port 80).

---

## 🔌 API Integration (`src/api/index.js`)

All requests to the backend go through `src/api/index.js`, which uses **Axios** with the base URL from `.env`:

```js
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
```

Key calls made by the frontend:

| Action | Method | Endpoint |
|---|---|---|
| Load confessions | `GET` | `/api/notes/` |
| Submit confession | `POST` | `/api/notes/` |
| Like a confession | `POST` | `/api/notes/<id>/like/` |
| View single post | `GET` | `/api/notes/<id>/` |
| Login | `POST` | `/api/login/` |
| Register | `POST` | `/api/register/` |
| Get tags | `GET` | `/api/tags/` |

---

## 📦 Main Dependencies (`package.json`)

| Package | Purpose |
|---|---|
| `react` `react-dom` | UI framework |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP requests to Django API |
| `react-scripts` | CRA build tooling |

---

## 🗺️ Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | `Home` | Public confession wall (published posts) |
| `/submit` | `Submit` | Submit a new confession |
| `/confession/:id` | `Confession` | Single confession detail |
| `/pending` | `Pending` | Posts awaiting moderation |
| `/login` | `Login` | Login form |
| `/register` | `Register` | Registration form |
| `/profile` | `Profile` | User profile |
| `/support` | `Support` | Help / contact |
| `*` | `NotFound` | 404 page |

---

## 🛠️ Useful Scripts

| Command | Description |
|---|---|
| `npm start` | Start dev server at localhost:3000 |
| `npm run build` | Create production build |
| `npm test` | Run tests |