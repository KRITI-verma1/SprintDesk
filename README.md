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


Assumptions

•	The application is assumed to be used online through a modern web browser.
•	Task names, descriptions, priorities, deadlines, status, and other project information are assumed to be entered correctly.
•	Users are expected to understand concepts such as tasks, priorities, status, assignees, and sprints.
•	Dashboard metrics and progress indicators are assumed to be meaningful only when users keep task information updated.
•	The application assumes that work can be organized into projects, tasks, priorities, and sprint-like workflows.
•	Any progress or status shown on the dashboard is assumed to reflect the latest available information.
•	Dashboard usefulness depends heavily on data freshness. 
•	It is assumed that users accessing project information are authorized to view and modify that information.

Limitations

•	If the application does not implement WebSockets or similar technology, changes made by another user may not appear instantly without refreshing.
•	The application may have basic authentication but may not provide enterprise-level role-based access control, SSO, or advanced permission management.
•	Incorrect or outdated task information can make dashboard statistics and progress indicators inaccurate.
•	Features such as resource allocation, budget tracking, dependency management, advanced reporting, and portfolio management may not be available.
•	The application may not provide comprehensive email, push, or real-time notifications for task assignments, approaching deadlines, or status changes.
•	The application may be designed primarily as a prototype or small-team solution and may require optimization before handling a very large number of users, projects, or tasks.
•	A high task-completion percentage does not necessarily mean a project is on track; task complexity, blockers, dependencies, and resource availability also matter. 
•	Integration with tools such as Slack, Jira, GitHub, Google Calendar, or Microsoft Teams may not be available.
•	The application depends on internet connectivity and may not support creating or editing tasks while offline.
•	A production-ready version would need additional measures such as comprehensive input validation, rate limiting, audit logging, secure session management, and regular security testing.





