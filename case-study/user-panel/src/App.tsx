import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import MainLayout from './pages/MainLayout';
import DashboardHome from './pages/DashboardHome';
import CreateTask from './pages/CreateTask';
import MyTasks from './pages/MyTasks';

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
          <Route path="/create" element={
            <ProtectedRoute>
              <MainLayout>
                <CreateTask />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/my-tasks" element={
            <ProtectedRoute>
              <MainLayout>
                <MyTasks />
              </MainLayout>
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
