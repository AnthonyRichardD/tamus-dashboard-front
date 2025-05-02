import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App.tsx';
import './index.css';

import { Login } from './pages/Login.tsx';

import { DialogAlert } from './components/ui/dialogAlert.tsx';
import { LoadingSpinner } from './components/ui/loadingSpinner.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
    <LoadingSpinner />
    <DialogAlert />
  </StrictMode>
);
