
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checkingAdmin, setCheckingAdmin] = useState<boolean>(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          // Query the users table to check if this user is an admin
          // Convert user.id to a number since our database expects it
          const userId = user.id ? parseInt(user.id) : null;
          
          if (userId) {
            const { data } = await supabase
              .from('users')
              .select('id')
              .eq('id', userId)
              .single();
            
            // For this example, let's consider the first user (ID = 1) as admin
            // In a real app, you would have a proper admin flag or role column
            setIsAdmin(data?.id === 1);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        }
      }
      setCheckingAdmin(false);
    };

    if (user && adminOnly) {
      checkAdminStatus();
    } else {
      setCheckingAdmin(false);
    }
  }, [user, adminOnly]);

  if (loading || (adminOnly && checkingAdmin)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mealhq-red"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
