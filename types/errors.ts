type AppErrorType = "network" | "service" | "unknown";

type ErrorObject = {
  code?: string;
  message: string;
};

type ApiResponse<TError, TData = any> = {
  isSuccess: boolean;
  data?: TData;
  error?: TError;
};

type ApiError = {
  non_field_errors?: string[];
};
