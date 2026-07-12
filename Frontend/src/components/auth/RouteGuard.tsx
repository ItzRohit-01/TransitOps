import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: ('Manager' | 'Dispatcher' | 'Safety' | 'Analyst')[];
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children, allowedRoles }) => {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center font-inter">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs text-slate-400 font-semibold tracking-wider uppercase">Loading session...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to their default dashboard based on their role
    if (userRole === 'Dispatcher') {
      return <Navigate to="/dispatcher" replace />;
    } else if (userRole === 'Safety') {
      return <Navigate to="/safety" replace />;
    } else if (userRole === 'Analyst') {
      return <Navigate to="/finance" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};
