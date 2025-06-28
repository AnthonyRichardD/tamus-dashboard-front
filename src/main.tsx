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
import { ExamListPage } from "./components/exams/ExamListPage.tsx";

import { DialogAlert } from "./components/ui/dialogAlert.tsx";
import { LoadingSpinner } from "./components/ui/loadingSpinner.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rotas de autenticação/recuperação */}
        <Route path="/esqueci-minha-senha" element={<RecoverPasswordToken />} />
        <Route path="/recuperar-senha" element={<RecoverPassword />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas ou que usam o layout do Dashboard */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Adicione outras rotas do dashboard aqui, se houver */}
        </Route>

        {/* Rotas de Visualização Específicas */}
        <Route path="/paciente/:id" element={<PatientDetailsPage />} />
        <Route path="/exames" element={<ExamListPage />} /> {/* **NOVA ROTA PARA A PÁGINA DE EXAMES** */}

        {/* Rota padrão para testes ou 404 */}
        <Route path="/" element={<Login />} /> {/* Ou qualquer página inicial que você preferir */}
        <Route path="*" element={<div>Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
    <LoadingSpinner />
    <DialogAlert />
  </StrictMode>
);