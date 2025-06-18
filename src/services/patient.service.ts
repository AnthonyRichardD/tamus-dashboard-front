/**
 * @file patient.service.ts
 * @description Centraliza todas as chamadas de API relacionadas a pacientes.
 */

// ✅ 1. Importe os tipos do arquivo central.
import { Paciente, PaginatedResponse } from '@/types/patient.types';

// ❌ 2. REMOVA as definições de interface 'Paciente' e 'PaginatedResponse' que estavam aqui.

// --- Configuração da API (mantida como está) ---
const API_URL = import.meta.env.VITE_API_URL;
const getToken = (): string | null => localStorage.getItem("token");
const getAuthHeaders = (): HeadersInit => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getToken()}`,
});

// --- Funções do Serviço ---
// Agora as funções já usam os tipos importados, garantindo consistência.

/**
 * Busca uma lista paginada de pacientes na API.
 * @returns {Promise<PaginatedResponse>}
 */
export async function getPatients(page: number, limit: number): Promise<PaginatedResponse> {
  // ... (a lógica da função continua a mesma)
  const url = new URL(`${API_URL}/patients`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("limit_per_page", limit.toString());

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok || (data && data.is_error)) {
    throw new Error(data.message || "Erro desconhecido ao listar pacientes.");
  }
  return data;
}

/**
 * Busca os dados de um paciente específico pelo seu ID.
 * @returns {Promise<Paciente>}
 */
export async function getPatientById(patientId: string): Promise<Paciente> {
  // ... (a lógica da função continua a mesma)
  const response = await fetch(`${API_URL}/patients/${patientId}`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok || (data && data.is_error)) {
    throw new Error(data.message || "Não foi possível carregar os dados do paciente.");
  }
  return data.data;
}

/**
 * Atualiza os dados de um paciente existente.
 * @returns {Promise<void>}
 */
export async function updatePatient(patientId: string, patientData: Partial<Paciente>): Promise<void> {
  // ... (a lógica da função continua a mesma)
  const response = await fetch(`${API_URL}/patients/${patientId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(patientData),
  });
  const data = await response.json();
  if (!response.ok || (data && data.is_error)) {
    throw new Error(data.message || "Não foi possível salvar as alterações.");
  }
}