import api from './api';
import { ConsultationListResponse } from '@/types/consultation';

interface ListParams {
  page?: number;
  limit_per_page?: number;
  filters?: {
    [key: string]: string | number;
  };
}

class ConsultationService {
  async listConsultations(params?: ListParams): Promise<ConsultationListResponse> {
    try {
      const response = await api.get('/consultation', {
        params: {
          page: params?.page,
          limit_per_page: params?.limit_per_page,
          ...params?.filters,
        },
      });

      const responseData = response.data;

      if (Array.isArray(responseData)) {
        return {
          data: responseData,
          pagination: {
            total: responseData.length, 
            page: params?.page || 1,
            limit: params?.limit_per_page || 10,
            total_pages: 1, 
          },
        };
      } else if (
        responseData &&
        Array.isArray(responseData.data) &&
        typeof responseData.pagination === 'object' &&
        responseData.pagination !== null
      ) {
        return responseData as ConsultationListResponse;
      }

      console.error('Estrutura inesperada da API:', responseData);
      throw new Error('Dados inválidos da API');
    } catch (error: any) {
      console.error('Erro ao buscar consultas:', error);
      throw new Error(error?.response?.data?.message || 'Erro ao buscar consultas');
    }
  }
}

export default new ConsultationService();