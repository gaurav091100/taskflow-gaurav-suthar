# TaskFlow (Frontend take-home)

## 1. Overview

TaskFlow is a small task-management UI: register or log in, browse projects, open a project, and manage tasks (create, edit, delete, change status). This submission targets a **Frontend Engineer** scope: there is **no production Go backend**; instead the repo ships a **mock REST API** (Express) for Docker/production builds and **MSW** for local development.

**Stack:** React 19, TypeScript, Vite 8, React Router 7, TanStack Query, Axios, MSW 2. **UI:** custom components with inline styles (no external component library), responsive-friendly grid and flex layouts.

## 2. Architecture decisions

- **Dual API strategy:** In **development**, MSW intercepts calls to `VITE_API_BASE_URL` so you can run only `npm run dev`. In **production / Docker**, MSW is **not** started; the browser talks to the **mock-api** container (or any compatible server) on port 4000.
- **Central config:** `src/config.ts` exports `API_BASE_URL` so Axios and MSW handlers stay aligned.
- **React Query** for server state, mutations, and cache updates; **optimistic updates** only for quick **task status** changes (revert + message on failure).
- **Task list filters** are passed to the API as `?status=` and `?assignee=`; `assignee=unassigned` is supported by the mock (extension beyond a bare UUID-only filter for better UX).
- **Tradeoffs:** Assignee labels in the UI are hard-coded for the two seeded users (acceptable for a mock). Project/task ownership rules from the full-stack brief are not enforced server-side in the mock.

## 3. Running locally

**Prerequisites:** Docker Desktop (or Docker Engine + Compose).

```bash
git clone <your-repo-url>
cd taskflow-gaurav-suthar
cp .env.example .env
docker compose up --build
```

- **App:** http://localhost:3000 (configurable via `WEB_PORT` in `.env`)
- **Mock API:** http://localhost:4000 (`MOCK_API_PORT`)

**Local development (no Docker):**

```bash
npm install
npm run dev
```

MSW runs automatically in dev and mocks the API at `VITE_API_BASE_URL` (default `http://localhost:4000`).

## 4. Running migrations

Not applicable. There is no PostgreSQL in this frontend-only submission. Data lives in memory in the mock API / MSW.

## 5. Test credentials

Seed / mock users (either MSW or `mock-api`):

```
Email:    test@example.com
Password: password123
```

Additional user (same password): `jane@example.com` / `password123`.

## 6. API reference

Implements the assignment **Appendix A** shape (JSON bodies and status codes). Full request examples are in the Postman collection:

- `postman/TaskFlow.postman_collection.json` — import into Postman; set `baseUrl` and paste a JWT from login into `token` (the mock accepts any bearer token).

**Endpoints:** `POST /auth/register`, `POST /auth/login`, `GET|POST /projects`, `GET|PATCH|DELETE /projects/:id`, `GET|POST /projects/:id/tasks` (supports `status`, `assignee` query params), `PATCH|DELETE /tasks/:id`.

## 7. What you’d do with more time

- Replace the mock API with a real backend and generated OpenAPI client types.
- Add **Vitest + MSW** integration tests for auth and task flows (beyond Postman).
- Use a design system (e.g. shadcn) and a proper **modal/drawer** for task create/edit.
- **Accessible** form validation messages per field, and toast notifications for mutations.
- **Drag-and-drop** columns or dark mode (brief bonus items).

---

### Project layout

| Path | Purpose |
|------|---------|
| `src/` | React app |
| `src/mocks/` | MSW handlers (dev only) |
| `mock-api/` | Express mock (Docker + optional `node mock-api/index.mjs`) |
| `Dockerfile` | Multi-stage: Node build → nginx static |
| `docker-compose.yml` | `api` + `web` |
