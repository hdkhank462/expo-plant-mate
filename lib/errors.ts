export class AppErrors extends Error {
  name = "AppErrors";
  code?: string;

  constructor(error: AppError) {
    super(error.message);
    this.code = error.code;
  }

  static readonly UnknownError: AppError = {
    code: "UNKNOWN_ERROR",
    message:
      "Lỗi không xác định.\nVui lòng kiểm tra lại kết nối internet và thử lại.",
  };

  static unknownError() {
    return new AppErrors(this.UnknownError);
  }
}
