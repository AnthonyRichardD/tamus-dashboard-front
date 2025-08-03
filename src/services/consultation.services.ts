import { ConsultationDetailsResponse } from '@/types/consultation.types';
import api, { ApiError } from './api';

interface ListParams {
  page?: number;
  limit_per_page?: number;
  filters?: {
    [key: string]: string | number;
  };
  period?: 'today' | 'this_week' | 'all_period';
}

class ConsultationService {
  async listConsultations(
    params?: ListParams
  ): Promise<ConsultationDetailsResponse> {
    try {
      const response: ConsultationDetailsResponse = await api.get(
        '/consultation',
        {
          params: {
            page: params?.page,
            limit_per_page: params?.limit_per_page,
            ...params?.filters,
            period: params?.period,
          },
        }
      );
      return response;
    } catch (error: any) {
      console.error('Erro ao buscar consultas:', error);
      throw new Error(
        error?.response?.data?.message || 'Erro ao buscar consultas'
      );
    }
  }
}

export default new ConsultationService();
