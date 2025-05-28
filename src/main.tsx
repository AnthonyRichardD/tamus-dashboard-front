import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RecoverPassword from './pages/RecoverPassword.tsx';
import './index.css';

import App from './App.tsx';
import Dashboard from './pages/Dashboard.tsx';
import RecoverPasswordToken from './pages/RecoverPasswordToken.tsx';
import { Login } from './pages/Login.tsx';
import DashboardLayout from './components/layout/DashboardLayout.tsx';

import { DialogAlert } from './components/ui/dialogAlert.tsx';
import { LoadingSpinner } from './components/ui/loadingSpinner.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { ProtectedRoute } from './routes/ProtectedRoute.tsx';
import NotFound404 from './pages/NotFound404.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/esqueci-minha-senha" element={<RecoverPasswordToken />} />
          <Route path="/recuperar-senha" element={<RecoverPassword />} />
          <Route path="/" element={<App />} />
          <Route element={<DashboardLayout />}>
            <Route element={<ProtectedRoute requiredRoles={['admin', 'superadmin']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    <LoadingSpinner />
    <DialogAlert />
  </StrictMode>
);
