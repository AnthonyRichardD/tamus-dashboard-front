// src/services/patient.service.ts
import api from './api';
import type { ApiError } from './api';
import type { Patient, PaginatedResponse } from '@/types/patient.d.ts';

/**
 * Busca pacientes com paginação.
 */
export async function getPatients(
  page: number,
  limit: number
): Promise<PaginatedResponse<Patient> | ApiError> {
  try {
    const response: PaginatedResponse<Patient> = await api.get('/patients', {
      params: { page, limit_per_page: limit },
    });
    return response;
  } catch (error) {
    return error as ApiError;
  }
}

/**
 * Busca um paciente pelo ID.
 */
export async function getPatientById(
  patientId: string
): Promise<Patient | ApiError> {
  try {
    const response: Patient = await api.get(`/patients/${patientId}`);
    return response;
  } catch (error) {
    return error as ApiError;
  }
}

/**
 * Atualiza os dados de um paciente.
 */
export async function updatePatient(
  patientId: string,
  patientData: Partial<Patient>
): Promise<void | ApiError> {
  try {
    await api.put(`/patients/${patientId}`, patientData);
  } catch (error) {
    return error as ApiError;
  }
}
