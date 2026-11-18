# FinTrack — Project State & Architecture Log

**Status:** Complete & Containerized (Production Ready)  
**Last Updated:** November 2026

---

## 1. System Architecture Overview

FinTrack is a full-stack personal finance management application built with an asynchronous Python backend, a reactive TypeScript/JavaScript frontend, background task processing, and full Docker Compose orchestration.

- **Backend:** FastAPI (Python 3.12), Async SQLAlchemy 2.0, Alembic, Pydantic v2
- **Database & Cache:** PostgreSQL 16 (`asyncpg`), Redis 8
- **Background Workers:** Celery (asynchronous CSV financial report generation)
- **Frontend:** React 19, Vite, Tailwind CSS, TanStack Query v5, React Router, Lucide Icons
- **Reverse Proxy & Deployment:** Multi-stage Docker builds, Nginx (`nginx:stable-alpine`), Docker Compose
- **CI/CD:** GitHub Actions automated test suite (`pytest` + `aiosqlite` / `httpx`)

---

## 2. Completed Modules

### Backend (`/backend`)

- [x] **Authentication & Security:** JWT access tokens + `HttpOnly` refresh token cookie rotation, Argon2/Bcrypt password hashing, and strict user-scoped query isolation.
- [x] **Categories:** System default categories (seeded via Alembic) + custom user categories with color and icon metadata, supporting `income` and `expense` types.
- [x] **Transactions:** Full CRUD API with category type validation, date-range/category/type filtering, and paginated listing.
- [x] **Budgets:** Monthly category spending limits (`month`/`year` scoped) with real-time aggregation of `spent_amount`, `remaining_amount`, `percentage_used`, and `is_over_budget`.
- [x] **Reports & Async Exports:** Date-windowed financial summaries and Celery background tasks (`generate_csv_report`) with Redis task status polling and rate-limited export triggers.

### Frontend (`/frontend`)

- [x] **App Shell & Navigation:** Viewport-locked responsive layout (`AppLayout.jsx`) with collapsible sidebar, custom circular monogram branding, and mobile breakpoint detection (`window.matchMedia`).
- [x] **Dashboard:** High-level financial KPIs, category distribution breakdown, and recent transactions feed.
- [x] **Transactions Page:** Interactive ledger with filters, pagination, and unified `TransactionModal` for creating, editing, and deleting records.
- [x] **Categories Page:** Custom category manager with live icon/color preview and inline editing.
- [x] **Budgets Page:** Month/year navigator, category limit cards, three-tier threshold progress bars (`< 75%` emerald, `75–99%` amber, `≥ 100%` rose), and `BudgetModal`.
- [x] **Reports Page:** Custom date-range selector, savings/burn ratio cards, category breakdown table, and asynchronous CSV export polling workflow.

### Infrastructure & DevOps

- [x] **Multi-Stage Frontend Container:** `node:20-alpine` builder stage compiling Vite assets into a lightweight `nginx:stable-alpine` production image.
- [x] **Nginx Reverse Proxy:** SPA fallback routing (`try_files $uri $uri/ /index.html`) and internal Docker network proxying (`/api/` -> `http://fintrack_api:8000/api/`).
- [x] **CI Pipeline:** 27 automated integration tests covering auth, categories, transactions, budgets, and reports.

---

## 3. Resolved Engineering Edge Cases

1. **Async SQLAlchemy `MissingGreenlet` on Commit:** Prevented implicit synchronous lazy-loads on `updated_at` and relationship attributes during FastAPI response serialization by explicitly refreshing or eager-loading (`selectinload`) post-commit.
2. **SQLite vs. PostgreSQL Decimal Scale Consistency:** Added Pydantic `@field_validator` quantization (`Decimal("0.01")`) on monetary fields so integer inputs (e.g., `500`) serialize consistently as `"500.00"` across both SQLite (CI tests) and PostgreSQL (production).
3. **1-Indexed vs. 0-Indexed Month Synchronization:** Standardized month state to 1-indexed (`1–12`) across `BudgetsPage` API queries and `BudgetModal` `<input type="month">` handlers to match PostgreSQL storage.
4. **Nginx `/api/` Prefix Stripping:** Configured `proxy_pass http://fintrack_api:8000/api/;` to prevent duplicate `/api/v1/v1/` path resolution.
