// src/services/api.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface para o tipo de erro personalizado
interface ApiError {
  message: string;
  is_error: boolean;
}

// Interceptadores com tipagem
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response.data;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      message:
        (error.response?.data as { message: string }).message ||
        'Erro no servidor, tente novamente mais tarde',
      is_error: (error.response?.data as { is_error: boolean }).is_error,
    };

    if (error.response?.status === 403) {
      window.location.href = '/dashboard';
    }

    return Promise.reject(apiError);
  }
);

export default api;
