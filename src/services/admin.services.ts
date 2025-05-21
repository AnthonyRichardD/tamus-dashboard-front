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

class AdminService {
  async login(loginData: UserLogin): Promise<UserLoginResponse> {
    try {
      const response = await api.post('/auth', loginData);

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
        message: error.response?.data?.message || 'Erro ao realizar login',
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
