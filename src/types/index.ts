export type ApiResponse<T = any> = {
  success: boolean;
  error?: string | null;
  message: string;
  data?: T;
  redirectUrl?: string;
};
