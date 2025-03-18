import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { AxiosError } from "axios";
import api from "~/lib/axios.config";
import { STORAGE_KEYS } from "~/constants/values";
import { AppErrors, BaseSchemaError, ErrorWithCode } from "~/lib/errors";
import { useStore } from "~/stores/index";
import storage from "~/lib/storage";
import { LoginSchema, RegisterSchema } from "~/schemas/auth.schema";

export class AuthErrors<T> extends BaseSchemaError<T> {
  name = "AuthErrors";

  static readonly InvalidCredentials = {
    code: "INVALID_CREDENTIALS",
    message: "Email hoặc mật khẩu không chính xác",
  };
  static readonly EmailNotVerified = {
    code: "EMAIL_NOT_VERIFIED",
    message:
      "Email chưa được xác thực\nVui lòng kiểm tra hòm thư của bạn để xác thực tài khoản",
  };
  static readonly InvalidRegistrationSchema = {
    code: "INVALID_REGISTRATION_SCHEMA",
    message: "Invalid registration schema",
  };

  static invalidCredentials(errors: LoginErrorResponse) {
    const { non_field_errors } = errors;

    if (non_field_errors && non_field_errors[0].includes("not verified"))
      return new this(this.EmailNotVerified);

    return new this(this.InvalidCredentials);
  }

  static invalidRegistrationSchema(errors: RegisterErrorResponse) {
    const { email, password1, password2, non_field_errors } = errors;
    const properties: { [key: string]: string[] } = {};

    if (non_field_errors) return AppErrors.invalidSchema(non_field_errors);
    if (email) properties.email = email;
    if (password1) properties.password = password1;
    if (password2) properties.confirmPassword = password2;

    return new this<RegisterSchema>(this.InvalidRegistrationSchema, properties);
  }
}

export class GoogleSigninErrors extends ErrorWithCode {
  name = "GoogleSigninErrors";

  static readonly SignInRequired = "getTokens";
  static readonly SignInNetworkError = "7";

  static signInCancelled() {
    return new this(
      {
        code: "SIGN_IN_CANCELLED",
        message: statusCodes.SIGN_IN_CANCELLED,
      },
      { cause: "@react-native-google-signin/google-signin" }
    );
  }

  static signInRequired() {
    return new this(
      {
        code: "SIGN_IN_REQUIRED",
        message: statusCodes.SIGN_IN_REQUIRED,
      },
      { cause: "@react-native-google-signin/google-signin" }
    );
  }
}

const register = async (schema: RegisterSchema) => {
  console.log("Registering with credentials");

  try {
    const response = await api.request<LoginResponse>({
      url: "/auth/register/",
      method: "post",
      data: {
        email: schema.email,
        password1: schema.password,
        password2: schema.confirmPassword,
      },
    });

    const authToken: AuthToken = {
      access: response.data.access,
      refresh: response.data.refresh,
    };

    useStore.setState({
      isAuthenticated: true,
      userInfo: response.data.user,
      authToken,
    });

    // Save to storage
    await storage.set(STORAGE_KEYS.AUTH_TOKEN, authToken);
    await storage.set(STORAGE_KEYS.USER_INFO, response.data.user);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400)
        throw AuthErrors.invalidRegistrationSchema(error.response.data);
    }

    if (error instanceof AppErrors) throw error;
    throw AppErrors.unknownError({ cause: error });
  }
};

const loginWithCreds = async (schema: LoginSchema) => {
  console.log("Logging in with credentials");

  try {
    const response = await api.request<LoginResponse>({
      url: "/auth/login/",
      method: "post",
      data: schema,
    });

    const authToken: AuthToken = {
      access: response.data.access,
      refresh: response.data.refresh,
    };

    useStore.setState({
      isAuthenticated: true,
      userInfo: response.data.user,
      authToken,
    });

    // Save to storage
    await storage.set(STORAGE_KEYS.AUTH_TOKEN, authToken);
    await storage.set(STORAGE_KEYS.USER_INFO, response.data.user);

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400)
        throw AuthErrors.invalidCredentials(error.response.data);
    }

    if (error instanceof AppErrors) throw error;
    throw AppErrors.unknownError({ cause: error });
  }
};

const getGoogleTokens = async () => {
  if (GoogleSignin.hasPreviousSignIn()) await GoogleSignin.signOut();

  try {
    await GoogleSignin.signIn();
    const access_token = (await GoogleSignin.getTokens()).accessToken;
    return access_token;
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED || GoogleSigninErrors.SignInRequired:
          throw GoogleSigninErrors.signInCancelled();
        case statusCodes.SIGN_IN_REQUIRED:
          throw GoogleSigninErrors.signInRequired();
        case GoogleSigninErrors.SignInNetworkError:
          throw AppErrors.networkError({ cause: error });
      }
    }
    throw AppErrors.unknownError({ cause: error });
  }
};

const loginWithGoogle = async () => {
  console.log("Logging in with Google");

  const access_token = await getGoogleTokens();
  const response = await api.request<LoginResponse>({
    url: "/auth/google/",
    method: "post",
    data: { access_token },
  });

  const authToken: AuthToken = {
    access: response.data.access,
    refresh: response.data.refresh,
  };

  useStore.setState({
    isAuthenticated: true,
    userInfo: response.data.user,
    authToken,
  });

  // Save to storage
  await storage.set(STORAGE_KEYS.AUTH_TOKEN, authToken);
  await storage.set(STORAGE_KEYS.USER_INFO, response.data.user);
  return response.data;
};

const getUserInfo = async () => {
  console.log("Getting user info");

  const response = await api.request<UserInfo>({
    url: "/auth/user/",
    method: "get",
  });

  useStore.setState({ userInfo: response.data });

  await storage.set(STORAGE_KEYS.USER_INFO, response.data);
  return response.data;
};

const logout = async () => {
  console.log("Logging out");

  if (GoogleSignin.hasPreviousSignIn()) {
    await GoogleSignin.signOut();
  }

  await api.request({
    url: "/auth/logout/",
    method: "post",
  });

  useStore.setState({
    userInfo: null,
    authToken: null,
    isAuthenticated: false,
  });

  await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  await storage.remove(STORAGE_KEYS.USER_INFO);
};

export { getUserInfo, loginWithCreds, loginWithGoogle, logout, register };
