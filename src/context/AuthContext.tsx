import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContextType, LoginData, User } from '../types/auth.types';

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
            const response = await api.post('/login', credentials);
            const { user, token } = response.data;

            setUser(user);
            setToken(token);

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);

            navigate('/dashboard');
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Falha no login. Verifique suas credenciais.');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const hasPermission = (requiredRoles?: string[]) => {
        if (!requiredRoles || requiredRoles.length === 0) return true;
        return user?.roles.some((role) => requiredRoles.includes(role)) || false;
    };

    const value: AuthContextType = { user, token, login, logout, hasPermission };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }
    return context;
};
