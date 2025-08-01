import api from './api';
import { ApiError } from './api';
import type { PaginatedResponse } from '@/types/patient.d.ts';

interface UserLogin {
  email: string;
  password: string;
}

interface User {
  full_name: string;
  email: string;
  roles: string[];
  role?: string;
}

interface UserLoginResponse {
  token?: string;
  user?: User;
  message: string;
  is_error: boolean;
}

interface ResetPasswordRequest {
  code: string;
  new_password: string;
}

interface ResetPasswordResponse {
  message: string;
  is_error: boolean;
}

interface CreateAdminRequest {
  full_name: string;
  email: string;
  role: string;
  cpf: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  password: string;
}

interface CreateAdminResponse {
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

interface AdminListItem {
  id: string | number;
  full_name: string;
  email: string;
  role: string;
  status: 'ACTIVE' | 'INACTIVE';
}

interface ResetPasswordRequest {
  code: string;
  new_password: string;
}

interface ResetPasswordResponse {
  message: string;
  is_error: boolean;
}

interface CreateAdminRequest {
  full_name: string;
  email: string;
  role: string;
  cpf: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  password: string;
}

interface CreateAdminResponse {
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
  async list(
    params?: ListParams
  ): Promise<PaginatedResponse<AdminListItem> | ApiError> {
    try {
      const response = await api.get<PaginatedResponse<AdminListItem>>(
        '/admin/list',
        {
          params: {
            page: params?.page,
            limit_per_page: params?.limit_per_page,
            ...params?.filters,
          },
        }
      );
      return response;
    } catch (error) {
      return error as ApiError;
    }
  }

  async login(loginData: UserLogin): Promise<UserLoginResponse | ApiError> {
    try {
      const response = await api.post<UserLoginResponse>(
        '/auth/login',
        loginData
      );
      const data = response.data;

      return {
        token: data.token,
        user: data.user
          ? {
              full_name: data.user.full_name ?? '',
              email: data.user.email ?? '',
              role: data.user.role,
              roles: data.user.role ? [data.user.role] : [],
            }
          : undefined,
        message: data.message || 'Login realizado com sucesso',
        is_error: false,
      };
    } catch (error) {
      return error as ApiError;
    }
  }

  async RecoverPasswordToken(
    email: string
  ): Promise<{ token: string } | ApiError> {
    try {
      const response = await api.post<{ token: string }>('/admin/Recover', {
        email,
      });
      const data = response.data;
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      return error as ApiError;
    }
  }

  async resetPassword(
    resetData: ResetPasswordRequest
  ): Promise<ResetPasswordResponse | ApiError> {
    try {
      const response = await api.post<ResetPasswordResponse>(
        '/admin/reset',
        resetData
      );
      return response.data;
    } catch (error) {
      return error as ApiError;
    }
  }

  async createAdmin(
    adminData: CreateAdminRequest
  ): Promise<CreateAdminResponse | ApiError> {
    try {
      const response = await api.post<CreateAdminResponse>(
        '/admin/create',
        adminData
      );
      return response.data;
    } catch (error) {
      return error as ApiError;
    }
  }
}

export default new AdminService();
