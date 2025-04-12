
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to access this page',
      });
    }
  }, [user, loading, toast]);

  if (loading) {
    // You could render a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    // Redirect to the login page with the current location in the state
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
