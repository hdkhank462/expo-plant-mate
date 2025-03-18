import { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import api from "~/lib/axios.config";
import { STORAGE_KEYS } from "~/constants/values";
import { AppErrors, BaseSchemaError } from "~/lib/errors";
import { useStore } from "~/stores/index";
import storage from "~/lib/storage";
import {
  ChangePasswordSchema,
  CheckPasswordTokenSchema,
  EmailOnlySchema,
  ResetSetPasswordConfirmSchema,
  UpdateAccountSchema,
} from "~/schemas/account.schema";

interface UpdateAccountErrorResponse extends ApiError {
  //   avatar_url?: string[];
  first_name?: string[];
  last_name?: string[];
}

interface InvalidPasswordErrorResponse extends ApiError {
  password1?: string[];
  password2?: string[];
}

export class AccountErrors<T> extends BaseSchemaError<T> {
  name = "AccountErrors";

  static readonly InvalidUpdateAccount: ErrorObject = {
    code: "INVALID_UPDATE_ACCOUNT",
    message: "",
  };
  static readonly InvalidPassword: ErrorObject = {
    code: "INVALID_PASSWORD",
    message: "Mật khẩu không đúng định dạng",
  };
  static readonly InvalidToken: ErrorObject = {
    code: "INVALID_RESET_PASSWORD_TOKEN",
    message: "Token không chính xác hoặc đã hết hạn",
  };

  static invalidUpdateAccount(errors: UpdateAccountErrorResponse) {
    const { first_name, last_name, non_field_errors } = errors;
    const properties: { [key: string]: string | string[] } = {};

    if (non_field_errors) return this.invalidSchema(non_field_errors);
    // if (avatar_url) properties.avatarUrl = avatar_url;
    if (first_name) properties.firstName = first_name;
    if (last_name) properties.lastName = last_name;

    return new this<UpdateAccountSchema>(this.InvalidPassword, properties);
  }

  static invalidPassword(errors: any) {
    const { new_password1, new_password2, non_field_errors } = errors;
    const properties: {
      [key in keyof ChangePasswordSchema]?: string | string[];
    } = {};

    if (non_field_errors) return this.invalidSchema(non_field_errors);
    if (new_password1) properties.newPassword = new_password1;
    if (new_password2) properties.confirmNewPassword = new_password2;

    return new this<ChangePasswordSchema>(this.InvalidPassword, properties);
  }

  static invalidToken(errors: any) {
    const { token } = errors;
    const properties: {
      [key in keyof CheckPasswordTokenSchema]?: string | string[];
    } = {};

    if (token) properties.token = this.InvalidToken.message;

    return new this<CheckPasswordTokenSchema>(this.InvalidToken, properties);
  }
}

const updateAccount = async (schema: UpdateAccountSchema) => {
  console.log("Account Updating");

  try {
    const response = await api.request<UserInfo>({
      url: "/auth/user/",
      method: "patch",
      data: {
        // avatar_url: schema.avatarUrl,
        first_name: schema.firstName,
        last_name: schema.lastName,
      },
    });

    useStore.setState({
      userInfo: response.data,
    });

    // Save to storage
    await storage.set(STORAGE_KEYS.USER_INFO, response.data);

    Toast.show({
      type: "success",
      text1: "Thông báo",
      text2: "Cập nhật thông tin tài khoản thành công",
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400)
        throw AccountErrors.invalidUpdateAccount(error.response.data);
    }

    if (error instanceof AppErrors) throw error;
    throw AppErrors.unknownError({ cause: error });
  }
};

const emailVerification = async (schema: EmailOnlySchema) => {
  console.log("Email Verification");

  try {
    const response = await api.request({
      url: "/auth/register/resend-email",
      method: "post",
      data: schema,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400)
        throw AccountErrors.invalidSchema(
          error.response.data?.non_field_errors
        );
    }

    if (error instanceof AppErrors) throw error;
    throw AppErrors.unknownError({ cause: error });
  }
};

const resetPassword = async (schema: EmailOnlySchema) => {
  console.log("Password Reset");

  try {
    const response = await api.request({
      url: "/auth/password/reset/",
      method: "post",
      data: schema,
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400)
        throw AccountErrors.invalidSchema(
          error.response.data?.non_field_errors
        );
    }

    if (error instanceof AppErrors) throw error;
    throw AppErrors.unknownError({ cause: error });
  }
};

const resetPasswordConfirm = async (schema: ResetSetPasswordConfirmSchema) => {
  console.log("Password Reset");

  try {
    await api.request({
      url: "/auth/password/reset/confirm",
      method: "post",
      data: {
        uid: schema.uid,
        token: schema.token,
        new_password1: schema.newPassword,
        new_password2: schema.confirmNewPassword,
      },
    });

    Toast.show({
      type: "success",
      text1: "Thông báo",
      text2: "Đặt mật khẩu thành công",
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) {
        if (error.response?.data.token)
          throw AccountErrors.invalidToken(error.response.data);
        else throw AccountErrors.invalidPassword(error.response.data);
      }
    }

    if (error instanceof AppErrors) throw error;
  }
};

const checkPasswordResetToken = async (schema: CheckPasswordTokenSchema) => {
  console.log("Password Reset Check Token");
  const temp = schema.token.split(";");
  const uid = temp[0];
  const token = temp[1];

  try {
    await api.request({
      url: "/auth/password/reset/confirm",
      method: "post",
      data: {
        uid,
        token,
      },
    });

    return { uid, token };
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400 && error.response?.data.token)
        throw AccountErrors.invalidToken(error.response.data);
    }

    if (error instanceof AppErrors) throw error;
  }
};

const changePassword = async (schema: ChangePasswordSchema) => {
  console.log("Password Reset");

  try {
    const response = await api.request<UserInfo>({
      url: "/auth/password/change/",
      method: "post",
      data: {
        new_password1: schema.newPassword,
        new_password2: schema.confirmNewPassword,
      },
    });

    Toast.show({
      type: "success",
      text1: "Thông báo",
      text2: "Đổi mật khẩu thành công",
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400)
        throw AccountErrors.invalidPassword(error.response.data);
    }

    if (error instanceof AppErrors) throw error;
    throw AppErrors.unknownError({ cause: error });
  }
};

export {
  changePassword,
  checkPasswordResetToken,
  emailVerification,
  resetPassword,
  resetPasswordConfirm,
  updateAccount,
};
