import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    requiredRoles?: ('admin' | 'superadmin')[];
}

export const ProtectedRoute = ({ requiredRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, hasPermission } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRoles && !hasPermission(requiredRoles)) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};


