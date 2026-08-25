export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  error?: string;
  data?: T;
  redirectUrl?: string;
};
