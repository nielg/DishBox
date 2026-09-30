export interface AuthUser {
  id: number;
  email: string;
  role?: string;
}

export interface UserProfileData {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
}
