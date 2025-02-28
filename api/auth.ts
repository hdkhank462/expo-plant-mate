import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { AxiosError } from "axios";
import api from "~/lib/axios.config";
import { STORAGE_KEYS } from "~/lib/constants";
import { AppErrors } from "~/lib/errors";
import { useGlobalStore } from "~/lib/global-store";
import storage from "~/lib/storage";
import { LoginSchema, RegisterSchema } from "~/schemas/auth.schema";

export class AuthErrors<T> extends AppErrors {
  name = "AuthErrors";
  properties?: { [key in keyof T]?: string[] };

  constructor(error: AppError, properties?: { [key in keyof T]?: string[] }) {
    super(error);
    this.properties = properties;
  }

  static readonly InvalidCredentials: AppError = {
    code: "INVALID_CREDENTIALS",
    message: "Email hoặc mật khẩu không chính xác",
  };
  static readonly InvalidRegistrationSchema: AppError = {
    code: "INVALID_REGISTRATION_SCHEMA",
    message: "Invalid registration schema",
  };

  static invalidCredentials() {
    return new AuthErrors<LoginSchema>(this.InvalidCredentials, {
      password: [this.InvalidCredentials.message],
    });
  }

  static invalidRegistrationSchema(errors: RegisterErrorResponse) {
    const { email, password1, password2, non_field_errors } = errors;
    const properties: { [key: string]: string[] } = {};

    if (non_field_errors) {
      return AppErrors.invalidSchema(non_field_errors);
    }
    if (email) properties.email = email;
    if (password1) properties.password = password1;
    if (password2) properties.confirmPassword = password2;

    return new AuthErrors<RegisterSchema>(
      this.InvalidRegistrationSchema,
      properties
    );
  }
}

export class GoogleSigninErrors extends AppErrors {
  name = "GoogleSigninErrors";

  static readonly SignInRequired = "getTokens";
  static readonly SignInNetworkError = "7";

  static signInCancelled() {
    return new GoogleSigninErrors(
      {
        code: "SIGN_IN_CANCELLED",
        message: statusCodes.SIGN_IN_CANCELLED,
      },
      { cause: "@react-native-google-signin/google-signin" }
    );
  }

  static signInRequired() {
    return new GoogleSigninErrors(
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

    useGlobalStore.setState({
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
    throw error;
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

    useGlobalStore.setState({
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
      if (error.response?.status === 400) throw AuthErrors.invalidCredentials();
    }
    throw error;
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
        // case statusCodes.SIGN_IN_CANCELLED:
        //   throw GoogleSigninErrors.signInCancelled();
        // case statusCodes.SIGN_IN_REQUIRED:
        //   throw GoogleSigninErrors.signInRequired();
        case GoogleSigninErrors.SignInRequired:
          throw GoogleSigninErrors.signInCancelled();
        case GoogleSigninErrors.SignInNetworkError:
          throw AppErrors.networkError();
        // default:
        //   throw AppErrors.unknownError({ cause: error });
      }
    }
    // throw error;
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

  useGlobalStore.setState({
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

  useGlobalStore.setState({ userInfo: response.data });

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

  useGlobalStore.setState({
    userInfo: null,
    authToken: null,
    isAuthenticated: false,
  });

  await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
  await storage.remove(STORAGE_KEYS.USER_INFO);
};

export { getUserInfo, register, loginWithCreds, loginWithGoogle, logout };
