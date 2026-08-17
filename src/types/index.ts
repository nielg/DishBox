export type ApiResponse = {
  success: boolean;
  error?: string | null;
  message: string;
  data?: any;
};

export type dbResponse<T = any> = {
  success: boolean;
  result: T;
};
