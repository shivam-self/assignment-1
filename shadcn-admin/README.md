# AuraUI Admin Dashboard

A modern, high-performance administrative dashboard built with React 19, Vite, TanStack Router, TanStack Table, Recharts, and Tailwind CSS. Fully integrated with the AuraUI User Management backend API.

---

## Live Deployments

- **Frontend App**: [https://shadcn-admin-hazel.vercel.app](https://shadcn-admin-hazel.vercel.app)
- **Backend API**: [https://server-ten-alpha-18.vercel.app](https://server-ten-alpha-18.vercel.app)
- **MongoDB Atlas Database**: Live Cloud Cluster Connected

---

## Features

- **User Analytics Dashboard**: Real-time user metrics (Total Users, Active Users, Inactive Users, Recently Joined), User Growth charts, and Recent User activity list.
- **User Management (CRUD)**:
  - Live data fetching from `/api/users`
  - Create new users with validation
  - Edit existing users
  - Delete users with confirmation modal
  - Role-based badges (`admin`, `editor`, `viewer`) and status indicators (`active`, `inactive`)
  - Full-text search and role-filtering
- **Modern Architecture**:
  - React 19 + TypeScript
  - TanStack Router with type-safe file-based routing
  - TanStack Query (React Query) for performant caching & revalidation
  - Tailwind CSS with dark/light mode and custom theme support
  - Responsive sidebar and mobile drawer navigation

---

## Tech Stack

- **Framework**: React 19 + Vite
- **Routing**: TanStack Router
- **State & Data Fetching**: TanStack Query (React Query)
- **UI & Components**: Radix UI + Tailwind CSS
- **Charts**: Recharts
- **Forms & Validation**: React Hook Form + Zod
- **Icons**: Lucide React + Tabler Icons

---

## Getting Started Locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Ensure the backend server is running on `http://localhost:5000`. The Vite development server automatically proxies `/api` requests to `http://localhost:5000`.

### 3. Start Development Server

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### 4. Production Build

```bash
npm run build
```
