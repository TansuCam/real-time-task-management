import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Login from './pages/Login';
import MainLayout from './pages/MainLayout';
import DashboardHome from './pages/DashboardHome';
import PendingTasks from './pages/PendingTasks';
import AllTasks from './pages/AllTasks';
import { AdminUsers } from './pages/AdminUsers';

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <MainLayout>
                <DashboardHome />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/pending" element={
            <ProtectedRoute>
              <MainLayout>
                <PendingTasks />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <RoleRoute allowedRoles={['Admin', 'Moderator']}>
                <MainLayout>
                  <AllTasks />
                </MainLayout>
              </RoleRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin-users" element={
            <ProtectedRoute>
              <MainLayout>
                <AdminUsers />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
