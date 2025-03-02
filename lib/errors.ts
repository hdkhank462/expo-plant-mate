export class ErrorWithCode extends Error {
  name = "ErrorWithCode";
  code?: string;

  constructor(error: ErrorObject, options?: ErrorOptions) {
    super(error.message, options);
    this.code = error.code;
  }
}

export class BaseSchemaError<T> extends ErrorWithCode {
  name = "BaseSchemaError";
  properties?: { [key in keyof T]?: string | string[] };

  constructor(
    error: ErrorObject,
    properties?: { [key in keyof T]?: string | string[] },
    options?: ErrorOptions
  ) {
    super(error, options);
    this.properties = properties;
  }

  static readonly InvalidSchema: ErrorObject = {
    code: "INVALID_SCHEMA",
    message: "Invalid schema",
  };

  static invalidSchema(messages: string[]) {
    return new this(this.InvalidSchema, undefined, { cause: messages });
  }
}

export class AppErrors extends ErrorWithCode {
  name = "AppErrors";

  static readonly InvalidSchema = {
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
  static readonly NetworkError = {
    code: "NETWORK_ERROR",
    message:
      "Không thể kết nối đến máy chủ.\nVui lòng kiểm tra kết nối mạng và thử lại.",
  };
  static readonly UnknownError = {
    code: "UNKNOWN_ERROR",
    message:
      "Lỗi không xác định.\nVui lòng kiểm tra lại kết nối internet và thử lại.",
  };

  static invalidSchema(messages: string[]) {
    return new this(this.InvalidSchema, { cause: messages });
  }

  static networkError(options?: ErrorOptions) {
    return new this(this.NetworkError, options);
  }
  static unknownError(options?: ErrorOptions) {
    return new this(this.UnknownError, options);
  }
}

export const getErrorsString = <T>(errors?: {
  [key in keyof T]?: string | string[];
}) => {
  let errorsString: { [key in keyof T]?: string } = {};

  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      const error = errors[key];
      errorsString[key] =
        Array.isArray(error) && error.length > 0
          ? error[0]
          : typeof error === "string"
          ? error
          : "";
    }
  }

  return errorsString;
};
