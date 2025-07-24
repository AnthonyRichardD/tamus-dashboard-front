export interface User {
  full_name: string;
  email: string;
  roles: string[];
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginData) => Promise<{
    token?: string;
    user?: User;
    message: string;
    is_error: boolean;
  }>;
  logout: () => void;
  hasPermission: (requiredRoles?: string[]) => boolean;
  isAuthenticated: () => boolean;
}
