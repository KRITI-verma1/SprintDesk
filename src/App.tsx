import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBoardStore } from './store/useBoardStore';
import { useNotificationStore } from './store/useNotificationStore';
import { taskService } from './api/taskService';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { Loader2 } from 'lucide-react';

// Route-level Code Splitting with React.lazy
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const BoardPage = lazy(() => import('./pages/BoardPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const PageLoader: React.FC = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      <span className="text-xs text-slate-400 font-medium">Loading page...</span>
    </div>
  </div>
);

export const App: React.FC = () => {
  const { initializeBoard, isInitialized } = useBoardStore();
  const { initializeNotifications } = useNotificationStore();

  // Initialize board and notifications from taskService abstraction
  useEffect(() => {
    if (!isInitialized) {
      taskService.getInitialData().then((data) => {
        initializeBoard({
          tasks: data.tasks,
          users: data.users,
          sprints: data.sprints,
          comments: data.comments,
        });
        initializeNotifications(data.notifications);
      });
    }
  }, [initializeBoard, initializeNotifications, isInitialized]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Authenticated Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/board" element={<BoardPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
