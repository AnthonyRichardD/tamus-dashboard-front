import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import RecoverPassword from "./pages/RecoverPassword.tsx";
import "./index.css";

import Dashboard from "./pages/Dashboard.tsx";
import RecoverPasswordToken from "./pages/RecoverPasswordToken.tsx";
import { Login } from "./pages/Login.tsx";
import DashboardLayout from "./components/layout/DashboardLayout.tsx";

import { PatientDetailsPage } from "./components/patient/PatientDetailsPage.tsx";

import { DialogAlert } from "./components/ui/dialogAlert.tsx";
import { LoadingSpinner } from "./components/ui/loadingSpinner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/esqueci-minha-senha" element={<RecoverPasswordToken />} />
        <Route path="/recuperar-senha" element={<RecoverPassword />} />
        <Route path="/login" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="/paciente/:id" element={<PatientDetailsPage />} />
      </Routes>
    </BrowserRouter>
    <LoadingSpinner />
    <DialogAlert />
  </StrictMode>
)