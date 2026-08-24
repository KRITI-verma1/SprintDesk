SprintDesk — Sprint Management Dashboard

A production-oriented React + TypeScript sprint management application built with Vite, Tailwind CSS, Zustand, and TanStack Query.

Overview

SprintDesk is designed for software development teams to manage sprints, organize backlog and active tasks with interactive drag-and-drop, analyze sprint velocity and trends, and receive simulated real-time activity updates.

 Key Features

1. Authentication & Session Persistence 
- DummyJSON Auth API integration (`https://dummyjson.com/auth/login`).
- In-memory access token storage with refresh token stored in `localStorage`.
- Axios/Fetch API interceptor automatically injecting `Bearer <token>` headers.
- Silent token refresh on 401 Unauthorized with automatic request retrying.
- Protected route guards with full-screen validation state.
- Demo accounts quick-fill on the Login screen (`emilys` / `emilyspass`).

2. Interactive Kanban Sprint Board 
- 4 Columns: Backlog, In Progress, In Review, Done.
- Smooth drag-and-drop powered by `@dnd-kit/core` and `@dnd-kit/sortable`.
- Reordering within columns and across columns with dynamic task counts.
- Side Drawer: View/edit task titles, descriptions, status, priority, assignee, due date, and manage comments.
- Task CRUD: Add new tasks with validation, edit inline, and delete with modal confirmation.
- Filters: Search by keyword, filter by Priority (Low, Medium, High, Urgent), and filter by Assignee.
- Bonus: Undo last drag-and-drop action.

3. Analytics & Visualisations 
- Real-time charts powered by Recharts, dynamically reactive to board state changes:
  - Sprint Velocity: Completed vs. total tasks across historical sprints.
  - Task Status Distribution: Donut chart showing column proportions.
  - Priority Breakdown: Stacked bar chart of priorities per column.
  - Completion Trend: Cumulative completion curve over time.
- Metric summary cards: Completion Rate %, In Progress count, High/Urgent open count, Total Sprint tasks.

4. Design System & Component Library 
- Custom-built accessible UI primitives with Tailwind CSS (zero external component libraries):
  - `Button` (Primary, Secondary, Outline, Ghost, Danger with loading states & icons)
  - `Input` (Labels, validation states, helper text, icons)
  - `Select` (Accessible dropdowns)
  - `Modal` (Dialog with backdrop, focus handling, Escape key dismissal)
  - `Toast` (Notification toast container with auto-dismiss timers)
  - `DataTable` (Sortable columns, pagination, live search filter)
  - `Skeleton` (Pulsing loading placeholders)
- Dark Mode / Light Mode: Full theme switching with automatic system preference detection and `localStorage` persistence.

5. Real-Time Notification System 
- Simulated real-time polling from `https://jsonplaceholder.typicode.com/posts?_limit=5`.
- Tab-visibility aware: Pauses polling when the browser tab is hidden and resumes when active.
- Unread badge counter in navbar.
- Paginated notification dropdown popover with "Mark as read" and "Mark all as read".
- Pops a subtle Toast notification when new events arrive while the popover is closed.

6. Testing & Code Quality 
- Unit test coverage with Vitest + React Testing Library:
  - `useToast` store and auto-dismissal
  - `useBoardStore` CRUD, moving tasks, and order updates
  - `authInterceptor` Bearer token injection, 401 interception, silent refresh, and retried requests
- Route-level code splitting using `React.lazy` and `Suspense`.



Tech Stack

| Layer | Technologies |
|---|---|
| Framework | React 18+ |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS v3, Lucide Icons |
| Client State | Zustand (with localStorage persistence) |
| Server State | TanStack Query v5 |
| Drag & Drop| `@dnd-kit/core`, `@dnd-kit/sortable` |
| Charts| Recharts |
| Testing | Vitest, React Testing Library, JSDOM |

 Architecture & File Structure

```
sprint-project/
├── public/
│   └── mock-data.json
├── src/
│   ├── api/
│   │   ├── client.ts             # Auth interceptor & silent refresh
│   │   ├── authService.ts        # DummyJSON auth API
│   │   ├── taskService.ts        # Mock data abstraction & queries
│   │   └── notificationService.ts # Polling client
│   ├── types/                    # TypeScript interfaces
│   │   ├── auth.ts, task.ts, user.ts, sprint.ts, notification.ts
│   ├── store/                    # Zustand stores
│   │   ├── useAuthStore.ts
│   │   ├── useBoardStore.ts
│   │   ├── useThemeStore.ts
│   │   └── useNotificationStore.ts
│   ├── hooks/                    # Custom hooks
│   │   ├── useToast.ts
│   │   └── usePollingNotifications.ts
│   ├── components/
│   │   ├── ui/                   # Reusable Design System (Button, Input, Modal, etc.)
│   │   ├── layout/               # Navbar, Sidebar, ProtectedRoute, AppLayout
│   │   ├── board/                # KanbanBoard, Column, TaskCard, TaskDrawer, TaskModal
│   │   ├── analytics/            # VelocityChart, StatusPieChart, PriorityBarChart, CompletionTrendChart
│   │   └── notifications/        # NotificationPopover
│   ├── pages/                    # Route pages (LoginPage, DashboardPage, BoardPage, AnalyticsPage)
│   ├── test/                     # Vitest unit test suites
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
```

 Getting Started

 Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

 Installation
```bash
cd sprint-project
npm install
```

 Running Locally
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

Running Unit Tests
```bash
npm run test
```

Production Build
```bash
npm run build
```

 Demo Credentials
- Username: emilys
- Password: emilyspass


Assumptions: SprintDesk assumes that users have internet access, provide accurate task information, understand sprint and Kanban workflows, and regularly update task statuses. It also assumes that users are authorized to access the dashboard and that the displayed data represents the latest available project information.

Limitations: The current application uses mock data, browser storage, demo authentication, and simulated notifications. It has limited multi-user collaboration, authorization, integrations, offline support, and scalability. Dashboard accuracy depends on the quality and freshness of user-entered data. A production version would require a secure backend, database, real authentication, role-based permissions, real-time collaboration, backups, and stronger security controls.




