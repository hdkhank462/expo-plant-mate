type AppErrorType = "network" | "service" | "unknown";

type AppError = {
  code: number;
  message: string;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  error?: T;
};

type ApiError = {
  non_field_errors?: string;
};
