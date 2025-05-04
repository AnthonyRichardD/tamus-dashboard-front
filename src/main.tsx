import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import RecoverPassword from './pages/RecoverPassword.tsx';
import App from './App.tsx';
import './index.css';
import Dashboard from './pages/Dashboard.tsx';
import DashboardLayout from './components/layout/DashboardLayout.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/recuperar-senha" element={<RecoverPassword />} />
        <Route path="/" element={<App />} />

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
