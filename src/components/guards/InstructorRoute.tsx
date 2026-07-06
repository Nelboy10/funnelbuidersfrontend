// ============================================================
// Funnel Builders — Instructor Route Guard
// Allows INSTRUCTOR and ADMIN roles
// ============================================================

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface InstructorRouteProps {
  children: React.ReactNode;
}

export default function InstructorRoute({ children }: InstructorRouteProps) {
  const { isAdmin, isInstructor, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin && !isInstructor) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
