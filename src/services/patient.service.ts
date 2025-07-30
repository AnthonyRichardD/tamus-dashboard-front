import api from './api';
import { Paciente, PaginatedResponse } from '@/types/patient.types';

interface ErrorResponse {
  is_error: boolean;
  message: string;
}

class PatientService {
  async list(page: number, limit: number): Promise<PaginatedResponse | ErrorResponse> {
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

  async getById(patientId: string): Promise<Paciente | ErrorResponse> {
    try {
      const response = await api.get(`/patients/${patientId}`);
      return response.data.data;
    } catch (error: any) {
      return {
        is_error: true,
        message: error.response?.data?.message || 'Erro ao buscar dados do paciente.',
      };
    }
  }

  async update(patientId: string, patientData: Partial<Paciente>): Promise<{ message: string; is_error: boolean }> {
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
