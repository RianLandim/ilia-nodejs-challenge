export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
}
