import api from './api';
interface UserLogin {
  email: string;
  password: string;
}

interface UserLoginResponse {
  token?: string;
  user?: {
    full_name: string;
    email: string;
    roles: string[];
  };
  message: string;
  is_error: boolean;
}

interface ErrorResponse {
  is_error: boolean;
  message: string;
}

interface ResetPasswordRequest {
  code: string;
  new_password: string;
}

interface ResetPasswordResponse {
  message: string;
  is_error: boolean;
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
      const response = await api.post('/auth/login', loginData);

      return {
        token: response.data.token,
        user: {
          ...response.data.user,
          roles: [response.data.user.role],
        },
        message: response.data.message || 'Login realizado com sucesso',
        is_error: false,
      };
    } catch (error: any) {
      return {
        is_error: true,
        message: error.message || 'Erro ao realizar login',
      };
    }
  }

  async RecoverPasswordToken(email: string): Promise<ErrorResponse> {
    try {
      const response = await api.post('/admin/Recover', { email });

      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return error as ErrorResponse;
    }
  }

  async resetPassword(
    resetData: ResetPasswordRequest
  ): Promise<ResetPasswordResponse> {
    try {
      const response = await api.post('/admin/reset', resetData);

      return response as unknown as ResetPasswordResponse;
    } catch (error) {
      return error as ErrorResponse;
    }
  }
}

export default new AdminService();
