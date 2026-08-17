export type ApiResponse<T = any> = {
  success: boolean;
  error?: string | null;
  message: string;
  data?: T;
  redirectUrl?: string;
};

export type dbResponse<T = any> = {
  success: boolean;
  result: T;
};
