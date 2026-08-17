export type ApiResponse = {
  success: boolean;
  error?: string | null;
  message: string;
  data?: any;
};
