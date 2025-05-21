import { useAuth } from '@/context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
    const { token } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}