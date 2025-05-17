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

      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error) {
      return error as ErrorResponse;
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
