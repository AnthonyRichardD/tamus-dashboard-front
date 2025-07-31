// src/services/patient.service.ts
import {
  GetPatientByIdResponse,
  PatientConsultationResponse,
} from '@/types/patient.types';
import api from './api';
import type { ApiError } from './api';
import type { Patient, PaginatedResponse } from '@/types/patient.d.ts';

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

export async function getPatientById(
  patientId: string | undefined
): Promise<GetPatientByIdResponse | ApiError> {
  try {
    const response: GetPatientByIdResponse = await api.get(
      `/patients/show/${patientId}`
    );
    return response;
  } catch (error) {
    return error as ApiError;
  }
}

export async function getConsultationsByPatient(
  patientId: string | undefined
): Promise<PatientConsultationResponse | ApiError> {
  try {
    const response: PatientConsultationResponse = await api.post(
      `/patients/consult`,
      {
        patient_id: patientId,
      }
    );
    return response;
  } catch (error) {
    return error as ApiError;
  }
}

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
