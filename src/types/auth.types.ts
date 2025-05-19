export interface User {
  id: number;
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
  login: (data: LoginData) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRoles?: string[]) => boolean;
}
