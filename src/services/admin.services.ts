import api from './api';
interface UserLogin {
  email: string;
  password: string;
}

interface UserLoginResponse {
  token?: string;
  user?: {
    id: number;
    full_name: string;
    email: string;
    role: string;
  };
  message: string;
  is_error: boolean;
}

interface ErrorResponse {
  is_error: boolean;
  message: string;
}

interface ListParams {
  page?: number;
  limit_per_page?: number;
  filters?: {
    [key: string]: string | number;
  };
}

class AdminService {
  async list(params?: ListParams) {
    try {
      const response = await api.get('/admin/list', {
        params: {
          page: params?.page,
          limit_per_page: params?.limit_per_page,
        },
        data: params?.filters,
      });
      return response;
    } catch (error) {
      return error as ErrorResponse;
    }
  }
  async login(loginData: UserLogin): Promise<UserLoginResponse> {
    try {
      const response = await api.post('/auth', loginData);

      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return error as ErrorResponse;
    }
  }
}

export default new AdminService();
