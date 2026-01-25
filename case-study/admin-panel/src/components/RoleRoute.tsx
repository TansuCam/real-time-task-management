import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function RoleRoute({ children, allowedRoles }: RoleRouteProps) {
  const admin = useSelector((state: RootState) => state.auth.admin);

  if (!admin || !allowedRoles.includes(admin.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
