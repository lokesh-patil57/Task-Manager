# AI Smart Task Manager – Web Client

This is the React + Vite frontend for **AI Smart Task Manager**, an AI-assisted Kanban and analytics app.

## Features

- Authentication views (login, register, OAuth callback)
- Protected pages: Home, Dashboard, Analytics
- Kanban board with drag-and-drop columns and task cards
- Task creation/editing modal with status, priority, deadline, and estimates
- AI schedule, AI suggestions, and AI task breakdown modals
- Analytics dashboards built with Recharts
- Animated UI with Framer Motion
- Toast notifications, loading buttons, spinners, and skeleton loaders

## Tech stack

- React 18 + Vite
- React Router
- TailwindCSS
- Framer Motion
- Axios
- React Beautiful DnD
- Recharts
- React Toastify

## Environment variables (client)

Create a `.env` file in the `client/` folder for frontend config:

```bash
# Base URL of the backend API (used by Axios)
VITE_API_URL=http://localhost:5001
```

## Getting started (client only)

From the project root:

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

> For full project setup (backend, environment variables, and deployment notes), see the root `README.md`.

