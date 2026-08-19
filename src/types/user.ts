export type UserLoginResponse = {
  id: number;
  user_name: string;
  email: string;
};

export interface AuthUser {
  id: number;
  email: string;
  role?: string;
}
