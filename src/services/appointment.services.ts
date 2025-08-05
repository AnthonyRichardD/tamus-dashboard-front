import api from './api';
import { ApiError } from './api';

export interface listConsultationTypesResponse {
  is_error: boolean;
  message: string;
  id: number;
  name: string;
  duration_minutes: number;
  active: boolean;
}

class AppointmentService {
  async listConsultationTypes(): Promise<
    listConsultationTypesResponse | ApiError
  > {
    try {
      const response: listConsultationTypesResponse = await api.get(
        '/consultationtype/list'
      );
      return response;
    } catch (error) {
      return error as ApiError;
    }
  }

  async getProffessionalsByConsultationType(consultationTypeId: number) {
    try {
      const response = await api.get(
        `consultationtype/${consultationTypeId}/professionals`
      );
      return response;
    } catch (error) {
      return error as ApiError;
    }
  }

  async getProfessionalsAvaliableDays(professionalId: number) {
    try {
      const response = await api.get(
        `/professionals/${professionalId}/available-days`
      );
      return response;
    } catch (error) {
      return error as ApiError;
    }
  }
  async getProfessionalAvailableTime(professionalId: number, date: string) {
    try {
      const response = await api.get(
        `/professionals/${professionalId}/available-slots`,
        {
          params: {
            date: date,
          },
        }
      );
      return response;
    } catch (error) {
      return error as ApiError;
    }
  }

  async create(data) {
    try {
      const response = await api.post('/appointments/create', data);
      return response;
    } catch (error) {
      return error as ApiError;
    }
  }
}

export default new AppointmentService();
