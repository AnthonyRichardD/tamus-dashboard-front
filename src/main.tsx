import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RecoverPassword from './pages/RecoverPassword.tsx';
import './index.css';

import App from './App.tsx';
import Dashboard from './pages/Dashboard.tsx';
import RecoverPasswordToken from './pages/RecoverPasswordToken.tsx';
import DashboardLayout from './components/layout/DashboardLayout.tsx';

import AdminCreationForm from './pages/AdminCreationForm.tsx';

import { Login } from './pages/Login.tsx';
import { AdminList } from './pages/admin/List.tsx';

import { AuthProvider } from './context/AuthContext.tsx';
import { ProtectedRoute } from './routes/ProtectedRoute.tsx';
import NotFound404 from './pages/NotFound404.tsx';
import ConultationDetails from './pages/ConsultationDetails.tsx';
import { PatientList } from './pages/PatientList.tsx';
import PatientUpdate from "./pages/update/PatientUpdate.tsx";
import "./index.css";


import { PatientDetailsPage } from "./components/patient/PatientDetailsPage.tsx";

import { DialogAlert } from "./components/ui/dialogAlert.tsx";
import { LoadingSpinner } from "./components/ui/loadingSpinner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/esqueci-minha-senha" element={<RecoverPasswordToken />} />
          <Route path="/recuperar-senha" element={<RecoverPassword />} />
          <Route path="/" element={<App />} />
          <Route element={<DashboardLayout />}>
            <Route path="/detalhes-consulta" element={<ConultationDetails />} />
            <Route element={<ProtectedRoute requiredRoles={['admin', 'superadmin']} />}>
              <Route path="/admin/create" element={<AdminCreationForm />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            <Route path="/patients/editar/:id" element={<PatientUpdate />} />
            <Route path="/lista-de-paciente" element={< PatientList />} />

            <Route element={<ProtectedRoute requiredRoles={['superadmin']} />}>
              <Route path="/admin/list" element={<AdminList />} />
            </Route>

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/paciente/:id" element={<PatientDetailsPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound404 />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
    <LoadingSpinner />
    <DialogAlert />
  </StrictMode>
)