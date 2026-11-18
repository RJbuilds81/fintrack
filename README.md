# FinTrack — Full-Stack Personal Finance & Budgeting Platform

FinTrack is a full-stack personal finance web application engineered for tracking income and expenses, enforcing monthly category budgets, analyzing financial ratios, and exporting asynchronous CSV reports.

---

## Key Features

- **Secure JWT Authentication:** Dual-token authentication flow featuring short-lived access tokens and `HttpOnly` refresh token cookies with automatic silent renewal.
- **Transaction Ledger:** Full CRUD transaction management with multi-criteria filtering (category, type, date range), pagination, and strict category-type validation.
- **Dynamic Monthly Budgeting:** Set monthly spending caps per expense category with real-time spent/remaining calculations and visual threshold indicators.
- **Financial Analytics & Reporting:** Interactive date-range reports calculating Savings Rate, Burn Rate, and Daily Average Spend.
- **Asynchronous CSV Exports:** Background report generation powered by Celery and Redis, complete with rate limiting and non-blocking frontend status polling.
- **Responsive Dark-Mode UI:** Collapsible sidebar navigation, custom category iconography, and mobile-friendly layouts built with React and Tailwind CSS.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Python 3.12, FastAPI, SQLAlchemy 2.0 (Async), Alembic, Pydantic v2 |
| **Frontend** | React 19, Vite, Tailwind CSS, TanStack Query, React Router, Lucide Icons |
| **Database & Broker** | PostgreSQL 16 (`asyncpg`), Redis 8 |
| **Background Tasks** | Celery |
| **Infrastructure** | Docker, Docker Compose, Nginx |
| **Testing & CI** | Pytest, HTTPX (`AsyncClient`), GitHub Actions |

---

## Architecture

```text
Browser (React SPA)
       │
       ▼
  Nginx (:3000) ──► Serves static Vite build (SPA routing)
       │
       ├── /api/v1/* ──► FastAPI (:8000) ──► PostgreSQL (:5432)
       │                        │
       │                        ▼
       │                  Redis (:6379) ◄── Celery Worker (CSV Exports)
```

---

## Getting Started (Docker Compose)

### Prerequisites

- Docker & Docker Compose installed

### 1. Clone the Repository

```bash
git clone https://github.com/Rishab-Jain-81/fintrack.git
cd fintrack
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory (or rely on the development defaults in `docker-compose.yml`):

```env
DATABASE_NAME=fintrack
POSTGRE_USER=postgres
POSTGRE_PASSWORD=postgres
JWT_SECRET_KEY=replace-with-a-secure-32-character-secret-key
```

### 3. Build and Start All Services

```bash
docker compose up --build
```

Once healthy, access the application:

- **Web Application:** `http://localhost:3000`
- **Interactive API Docs (Swagger):** `http://localhost:8000/docs`

---

## Running Automated Tests

The backend includes an asynchronous integration test suite powered by `pytest` and `httpx`:

```bash
cd backend
uv run pytest -v
```

---

## Project Structure

```text
fintrack/
├── .github/workflows/   # CI/CD automated test pipeline
├── backend/
│   ├── alembic/         # Database migrations & default category seeding
│   ├── app/
│   │   ├── api/v1/      # FastAPI route handlers (auth, transactions, categories, budgets, reports)
│   │   ├── core/        # Config, security, database & Celery setup
│   │   ├── models/      # SQLAlchemy ORM models
│   │   ├── schemas/     # Pydantic request/response schemas
│   │   └── tasks/       # Celery background workers
│   ├── tests/           # Pytest async API test suite
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/         # Axios client & endpoint wrappers
│   │   ├── components/  # Reusable UI modals, cards, and layout shell
│   │   ├── hooks/       # Custom auth and polling hooks
│   │   └── pages/       # Dashboard, Transactions, Categories, Budgets, Reports
│   ├── nginx.conf       # SPA routing & API reverse proxy config
│   └── Dockerfile       # Multi-stage Node + Nginx production build
└── docker-compose.yml   # Multi-container orchestration
```
