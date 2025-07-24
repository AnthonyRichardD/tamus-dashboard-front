import axios, { AxiosInstance, AxiosError } from 'axios';

export interface ApiError {
  message: string;
  is_error: boolean;
}

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data, 
  (error: AxiosError): Promise<ApiError> => {
    const apiError: ApiError = {
      message:
        (error.response?.data as { message?: string })?.message ??
        'Erro no servidor. Tente novamente mais tarde.',
      is_error:
        (error.response?.data as { is_error?: boolean })?.is_error ?? true,
    };

    if (error.response?.status === 403) {
      window.location.href = '/dashboard';
    }

    return Promise.reject(apiError);
  }
);

export default api;
