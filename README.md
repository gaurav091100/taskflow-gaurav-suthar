## 1. Overview

TaskFlow is a small task-management UI: register or log in, browse projects, open a project, and manage tasks (create, edit, delete, change status). This submission targets a **Frontend Engineer** scope: there is **no production Go backend**; instead the repo ships a **mock REST API** (Express) for Docker/production builds and **MSW** for local development.

---

## 2. Tech Stack

- React 19
- TypeScript
- Vite 8
- React Router 7
- TanStack Query (React Query)
- Tailwindcss and shadcn/ui
- Axios
- MSW (Mock Service Worker)
- Express (Mock API for Docker)
- Docker + Docker Compose

---

## 3. Features

- User authentication (mocked)
- Project management (CRUD)
- Task management (CRUD)
- Task filtering (status + assignee)
- Optimistic UI updates
- Responsive UI (Flex + Grid)
- MSW for local development
- Full Dockerized environment

---

## 4. Project Structure

src/
├── app/           # App-level setup (providers, routing)
├── assets/        # Static assets
├── components/    # Shared UI components
├── features/      # Feature-based modules
├── lib/           # Shared utilities & API layer
├── mocks/         # Mock Service Worker setup
├── pages/         # Route-level components
├── utils/         # Helper constants & functions

mock-api/
└── index.mjs        # Express mock backend (Docker runtime)

---
## 5. Architecture decisions

- **Dual API strategy:** In **development**, MSW intercepts calls to `VITE_API_BASE_URL` so you can run only `npm run dev`. In **production / Docker**, MSW is **not** started; the browser talks to the **mock-api** container (or any compatible server) on port 4000.
- **Central config:** `src/config.ts` exports `API_BASE_URL` so Axios and MSW handlers stay aligned.
- **React Query** for server state, mutations, and cache updates; **optimistic updates** only for quick **task status** changes (revert + message on failure).
- **Task list filters** are passed to the API as `?status=` and `?assignee=`; `assignee=unassigned` is supported by the mock (extension beyond a bare UUID-only filter for better UX).
- **Tradeoffs:** Assignee labels in the UI are hard-coded for the two seeded users (acceptable for a mock). Project/task ownership rules from the full-stack brief are not enforced server-side in the mock.

### ⚙️ Central Config
All API URLs are managed via `src/config.ts`

Ensures consistency between:
- Axios
- MSW
- Docker environment

### 📡 State Management
- React Query handles all server state
- Mutations with automatic cache invalidation
- Optimistic updates for task status changes


## 6. Running with Docker (Recommended)

### Prerequisites
- Docker Desktop installed

### Steps

git clone https://github.com/gaurav091100/taskflow-gaurav-suthar.git
cd taskflow
cp .env.example .env
docker compose up --build

### 🌐 Access URLs
- Frontend: http://localhost:3000
- Mock API: http://localhost:4000

---

## 7. Running Locally (Without Docker)

npm install
npm run dev

MSW runs automatically in development mode and mocks API requests.

---

## 8. Test Credentials

Email: test@example.com  
Password: password123

Email: jane@example.com  
Password: password123

---

## 9. Running migrations

Not applicable. There is no PostgreSQL in this frontend-only submission. Data lives in memory in the mock API / MSW.

---


## 10. API Reference

Auth:
- POST /auth/register
- POST /auth/login

Projects:
- GET /projects
- POST /projects
- GET /projects/:id
- PATCH /projects/:id
- DELETE /projects/:id

Tasks:
- GET /projects/:id/tasks
- POST /projects/:id/tasks
- PATCH /tasks/:id
- DELETE /tasks/:id

Filters:
?status=todo
?assignee=unassigned

---

## 11. Testing

No automated tests included yet.

---

## 12. Docker Architecture

- web → React frontend (Vite + Nginx)
- api → Express mock backend
- One command runs full stack:

docker compose up --build

---

## 13. What you’d do with more time

- **Accessible** form validation messages per field, and toast notifications for mutations.
- **Drag-and-drop** columns or dark mode (brief bonus items).

---

## 📌 Notes

- MSW used only in development
- Docker runs production-like mock backend
- No real database (in-memory only)
