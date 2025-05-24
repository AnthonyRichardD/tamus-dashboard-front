import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, LoginData, User } from '../types/auth.types';
import adminServices from '@/services/admin.services';
import api from '@/services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() =>
        JSON.parse(localStorage.getItem('user') || 'null')
    );
    const [token, setToken] = useState<string | null>(() =>
        localStorage.getItem('token')
    );
    const navigate = useNavigate();

    const login = async (credentials: LoginData) => {
        try {
            const response = await adminServices.login(credentials);
            if (response.token && response.user) {
                setUser(response.user);
                setToken(response.token);
                localStorage.setItem('token', response.token);

                api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;

                navigate('/dashboard');
                return;
            }
            throw new Error(response.message || 'Falha no login');
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Falha no login. Verifique suas credenciais.');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        delete api.defaults.headers.common['Authorization'];

        navigate('/login');
    };

    const hasPermission = (requiredRoles?: string[]) => {
        if (!requiredRoles || requiredRoles.length === 0) return true;
        return user?.roles.some((role) => requiredRoles.includes(role)) || false;
    };

    const isAuthenticated = !!user;


    const value: AuthContextType = { user, token, login, logout, hasPermission, isAuthenticated };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
};
