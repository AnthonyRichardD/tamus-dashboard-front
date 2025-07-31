import {
  GetPatientByIdResponse,
  PatientConsultationResponse,
} from '@/types/patient.types';
import api from './api';
import type { ApiError } from './api';
import type { Patient, PaginatedResponse } from '@/types/patient.d.ts';

interface ErrorResponse {
  is_error: boolean;
  message: string;
}

class PatientService {
  async list(
    page: number,
    limit: number
  ): Promise<PaginatedResponse | ErrorResponse> {
    try {
      const response = await api.get('/patients/list', {
        params: {
          page,
          limit_per_page: limit,
        },
      });
      return response;
    } catch (error: any) {
      return {
        is_error: true,
        message: error.response?.data?.message || 'Erro ao buscar pacientes.',
      };
    }
  }

  async getPatientById(
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

  async getConsultationsByPatient(
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

  async getById(patientId: string): Promise<Paciente | ErrorResponse> {
    try {
      const response = await api.get(`/patients/${patientId}`);
      return response.data.data;
    } catch (error: any) {
      return {
        is_error: true,
        message:
          error.response?.data?.message || 'Erro ao buscar dados do paciente.',
      };
    }
  }

  async update(
    patientId: string,
    patientData: Partial<Paciente>
  ): Promise<{ message: string; is_error: boolean }> {
    try {
      const response = await api.put(`/patients/${patientId}`, patientData);
      return {
        message: response.data.message || 'Paciente atualizado com sucesso.',
        is_error: false,
      };
    } catch (error: any) {
      return {
        is_error: true,
        message: error.response?.data?.message || 'Erro ao atualizar paciente.',
      };
    }
  }
}

export default new PatientService();
