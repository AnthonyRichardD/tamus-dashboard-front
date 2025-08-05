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
}

export default new AppointmentService();
