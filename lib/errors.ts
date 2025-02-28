export class AppErrors extends Error {
  name = "AppErrors";
  code?: string;

  constructor(error: AppError, options?: ErrorOptions) {
    super(error.message, options);
    this.code = error.code;
  }

  static readonly InvalidSchema: AppError = {
    code: "INVALID_SCHEMA",
    message: "Invalid schema",
  };
  static readonly Unauthorized = {
    code: "UNAUTHORIZED",
    message: "Unauthorized",
  };
  static readonly SessionExpired = {
    code: "SESSION_EXPIRED",
    message: "Phiên đăng nhập đã hết hạn",
  };
  static readonly NetworkError: AppError = {
    code: "NETWORK_ERROR",
    message:
      "Không thể kết nối đến máy chủ.\nVui lòng kiểm tra kết nối mạng và thử lại.",
  };
  static readonly UnknownError: AppError = {
    code: "UNKNOWN_ERROR",
    message:
      "Lỗi không xác định.\nVui lòng kiểm tra lại kết nối internet và thử lại.",
  };

  static invalidSchema(messages: string[]) {
    return new AppErrors(this.InvalidSchema, { cause: messages });
  }

  static networkError(options?: ErrorOptions) {
    return new AppErrors(this.NetworkError, options);
  }
  static unknownError(options?: ErrorOptions) {
    return new AppErrors(this.UnknownError, options);
  }
}
