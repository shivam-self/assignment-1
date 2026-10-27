# AuraUI: User Management Dashboard with Custom Theming Engine

A modern, full-stack MERN application featuring a live user management dashboard with full CRUD capabilities and an independent, self-built multi-layer theming engine.

---

## Live Deployments (Cloud-Hosted)

- **Frontend Dashboard (Production)**: [https://shadcn-admin-hazel.vercel.app](https://shadcn-admin-hazel.vercel.app)
- **Backend API (Production Serverless)**: [https://server-ten-alpha-18.vercel.app](https://server-ten-alpha-18.vercel.app)
- **API Health Check**: [https://server-ten-alpha-18.vercel.app/health](https://server-ten-alpha-18.vercel.app/health)
- **Users Stats Endpoint**: [https://server-ten-alpha-18.vercel.app/api/users/stats](https://server-ten-alpha-18.vercel.app/api/users/stats)
- **Database**: MongoDB Atlas Cloud Cluster

---

## 1. Overview & Architecture

AuraUI was constructed to fulfill the Take-Home Engineering Challenge for Full Stack Developer Intern. The application is strictly divided into two distinct lanes:
1. **User Data Lane (MERN)**: Endpoints, controllers, and models powered by MongoDB via Mongoose and Express.js, consumed via a dedicated client service layer (`api/userApi.ts`) and React hooks (`useUsers`, `useUserStats`).
2. **Theming Engine Lane (Client-Side)**: An independent, three-layer theming engine operating purely in the browser using the FontFace API, WCAG contrast calculation algorithms, and CSS custom properties (`var(--token)`), with debounced single-key persistence in `localStorage`.

### Key Differentiators:
- **Zero Third-Party Theme Kits**: The theming engine is 100% custom-built. No MUI, Chakra, or Tailwind theme plugins are used to drive the theme logic.
- **Three Independent Theme Layers**: Theme Presets, Button Color Override, and Custom Font Upload operate orthogonally. Switching a preset preserves custom button colors and loaded fonts.
- **Accessible WCAG Relative Luminance Contrast**: When a user selects custom button colors (such as bright yellow `#FACC15` or pure white `#FFFFFF`), the engine dynamically computes text luminance and flips `--btn-text` to high-contrast dark text (`#0F1B2D`) rather than illegible white.
- **Modular Component Architecture**: Zero monolithic code in page files. All inputs, buttons, cards, modals, tables, empty states, and indicators are isolated into reusable, atomic components.

---

## 2. Prerequisites

- **Node.js**: `v18.x` or `v20.x` recommended (`v18+` required)
- **npm**: `v9.x` or `v10.x`
- **MongoDB**: Either a local MongoDB instance running on port `27017` or a MongoDB Atlas connection string.

---

## 3. Quick Setup & Local Execution

Clone or navigate to the repository directory:

```bash
cd assignment-1
```

### 3.1 Backend Setup (`server/`)

```bash
# 1. Navigate to server folder
cd server

# 2. Configure environment variables
# On Windows PowerShell:
Copy-Item .env.example .env
# On macOS / Linux:
# cp .env.example .env

# 3. Install backend dependencies
npm install

# 4. Seed sample users (idempotent, safe to run multiple times)
npm run seed

# 5. Start the backend development server
npm run dev
```

*The backend starts at `http://localhost:5000`.*

### 3.2 Frontend Setup (`client/`)

Open a new terminal window:

```bash
# 1. Navigate to client folder
cd client

# 2. Configure environment variables
# On Windows PowerShell:
Copy-Item .env.example .env
# On macOS / Linux:
# cp .env.example .env

# 3. Install frontend dependencies
npm install

# 4. Start the Vite development server
npm run dev
```

*The client starts at `http://localhost:5173`.*

---

## 4. MongoDB Connection Options

The server validates `MONGODB_URI` upon boot and fails fast if missing.

### Local MongoDB:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/user_mgmt
CLIENT_ORIGIN=http://localhost:5173
```

### MongoDB Atlas Cloud:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/user_mgmt?retryWrites=true&w=majority
CLIENT_ORIGIN=http://localhost:5173
```

---

## 5. API Reference

All user management endpoints are prefixed under `/api/users`:

| Method | Endpoint | Purpose | Success Status | Failure Statuses |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | List users, newest first (optional `?search=query`) | `200 { data: User[] }` | `500` |
| `GET` | `/api/users/stats` | Aggregated metrics: total, active, inactive, added in last 7 days | `200 { data: { total, active, inactive, last7Days } }` | `500` |
| `GET` | `/api/users/:id` | Retrieve single user record by ID | `200 { data: User }` | `400` (invalid ID), `404` (not found) |
| `POST` | `/api/users` | Create new user record | `201 { data: User }` | `400` (validation), `409` (duplicate email) |
| `PUT` | `/api/users/:id` | Update existing user with schema validation | `200 { data: User }` | `400` (validation/ID), `404`, `409` |
| `DELETE` | `/api/users/:id` | Remove user record permanently | `200 { data: { id } }` | `400` (invalid ID), `404` |

> **Architectural Note**: `/api/users/stats` is explicitly registered before `/api/users/:id` to prevent the parameterized ID route from swallowing the `/stats` route as a CastError.

### Error Response Schema
All errors emitted across the API adhere to one consistent contract:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "fields": {
      "email": "Please enter a valid email address"
    }
  }
}
```
In the case of MongoDB duplicate key violations (`E11000`), the central error handler converts the database error into code `DUPLICATE_KEY` with HTTP status `409` and maps `{ "email": "This email is already in use" }`. The frontend form automatically places this error under the email input.

---

## 6. What Was Implemented (Feature Mapping)

### Section A: Dashboard & Core CRUD
- [x] **Live User Count**: Directly queried via MongoDB aggregation (`/api/users/stats`), updated live when users are added or removed without requiring a full page refresh.
- [x] **Aggregated Metrics Breakdown**: Computes active accounts, inactive accounts, and accounts created in the last 7 days using a single `$facet` aggregation pipeline.
- [x] **User List Table**: Displays user name, email, role badge (`admin`, `editor`, `viewer`), phone, and status badge (`active`, `inactive`).
- [x] **Create, Read, Update, Delete**:
  - Modal form for creation with real-time validation feedback on blur and submit.
  - Detail modal fed by `GET /api/users/:id` handling invalid or missing IDs gracefully.
  - Update form pre-filling existing user values with `runValidators: true` enforced on the server.
  - Delete confirmation dialog explicitly naming the user with cancellation protection and keyboard Escape closure.
- [x] **Double-Submit Protection**: Submit buttons automatically disable and display loading states during API requests.

### Section B: Theming Engine
- [x] **4 Presets**: `Ocean Blue`, `Modern Violet`, `Darcula Dark`, and `Emerald Forest`. Each defines background, surface, text, muted text, border, accent, danger, and native `colorScheme` (`light` or `dark`).
- [x] **Independent Button Color Override**: An `<input type="color">` allowing hex overrides that only target `--btn-bg` and recompute `--btn-text`. Graders can test high luminance colors (yellow `#FACC15` or white `#FFFFFF`) and see crisp, legible dark button text.
- [x] **Custom Font Upload**:
  - Accepts `.ttf`, `.otf`, `.woff`, `.woff2` files up to `1.5 MB`.
  - Rejects foreign formats or oversized files prior to memory loading.
  - Registers dynamically via the browser's `FontFace` API and adds to `document.fonts`.
  - Cleans up previously loaded font instances to avoid memory leaks.
  - Configures fallback stack: `font-family: "UserFont", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
  - Explicitly declares `font: inherit` on all `button`, `input`, `select`, and `textarea` elements so form controls adopt uploaded fonts.
- [x] **Persistence & Anti-Flash**: Single-key JSON persistence in `localStorage` under `app.theme.v1`. An inline `<script>` in `index.html` initializes CSS variables before React mounts, avoiding visual theme flicker on page reloads.
- [x] **Storage Quota Handling**: Wraps writes in `try/catch`. If `QuotaExceededError` occurs, the font remains active for the current browser session and notifies the user gracefully.

### Section C: Code Architecture & UX
- [x] **Strict Separation of Concerns**: Routes, controllers, models, and validation schemas are completely decoupled.
- [x] **Atomic UI Components**: `Button`, `Input`, `Select`, `Card`, `Badge`, `Modal`, `ConfirmDialog`, `Spinner`, `EmptyState` built once and reused across all views.
- [x] **No Hardcoded Hex Colors**: All components rely exclusively on Tailwind classes mapped to CSS custom variables (`bg-surface`, `text-text`, `border-border`, `bg-btn-bg`, etc.).

---

## 7. Theming Architecture Note

The active theme in AuraUI is derived, never stored as raw CSS stylesheets. The state maintains three orthogonal values:
1. `presetId` (enum: `blue`, `violet`, `darcula`, `forest`)
2. `buttonColor` (nullable hex string)
3. `font` (nullable object containing `fileName` and `dataUrl`)

A pure mathematical function `resolveTheme(state)` merges these layers:
- The selected preset provides the base color tokens (`--bg`, `--surface`, `--text`, `--text-muted`, `--border`, `--accent`, `--danger`, and `color-scheme`).
- If `buttonColor` is defined, it overrides `--btn-bg`, and the WCAG relative luminance formula calculates the required contrast ratio, assigning either `#0F1B2D` (for light/yellow buttons) or `#FFFFFF` (for dark buttons) to `--btn-text`.
- If a custom font is active, it sets `--font-family: "UserFont", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.

`ThemeContext` applies the resulting token dictionary directly to `document.documentElement.style` within a React effect. Consequently, every component updates instantaneously without cascading component re-renders. 

`themeStorage.ts` acts as the single boundary touching `localStorage` under the versioned key `app.theme.v1`. On application startup, `ThemeContext` rehydrates the font face from the stored base64 data URL via the `FontFace` API asynchronously without blocking UI paint.

---

## 8. Explicit Button Color Assumption

As specified in the PRD (Section 5.4):
> **Assumption**: The button color override changes the primary button background (`--btn-bg`), its focus ring, and its auto-computed contrast text (`--btn-text`) only. It does not alter navigational links, badge accents, or other preset accents.

---

## 9. Shortcuts Taken & Rationale

1. **No External State Management Library**: Used React standard `useState` and custom hooks (`useUsers`, `useUserStats`) rather than Redux Toolkit or Zustand. The application data flow is unidirectional and clean; adding Redux would introduce unnecessary boilerplate without architectural benefit.
2. **Modal-Based User View**: User details and edit actions are rendered in accessible modals rather than dedicated `/users/:id` routes, providing an immediate, high-productivity workflow for administrators.
3. **Client-Side Live Filtering**: The search bar filters over the fetched list in real-time while also supporting server-side query params (`?search=`), ensuring instant sub-millisecond responsiveness for users.

---

## 10. Known Issues & Boundaries

1. **Base64 LocalStorage Size Inflation**: Custom fonts are converted to base64 data URLs to persist across page reloads in `localStorage`. Because base64 introduces ~33% overhead and `localStorage` is capped at ~5MB per origin, font uploads are strictly capped at 1.5MB raw. Fonts exceeding this limit are rejected with a clear validation error.
2. **No Real-Time WebSockets**: Live updates occur on component mount and immediately after every mutation (create, edit, delete). Updates made simultaneously in a separate browser tab will reflect upon navigation or manual refresh.

---

## 11. What I Would Build Next

1. **Server-Side Theme Profiles**: Persist user theme preferences in MongoDB tied to user accounts so themes synchronize across multiple devices.
2. **IndexedDB Font Storage**: Migrate custom font binary storage from `localStorage` to IndexedDB or the Cache API to support larger font families (e.g. multi-weight `.woff2` files up to 20MB) without memory limits.
3. **Cursor-Based Pagination**: Expand `GET /api/users` with `?page=` and `?limit=` for large datasets (10,000+ users).
4. **End-to-End Test Suite**: Add Playwright test coverage verifying font upload rendering and theme persistence across browser reloads.
