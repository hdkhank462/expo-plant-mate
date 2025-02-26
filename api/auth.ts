import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AxiosError } from "axios";
import api, { ApiErrors } from "~/lib/axios.config";
import { STORAGE_KEYS } from "~/lib/constants";
import { AppErrors } from "~/lib/errors";
import { useGlobalStore } from "~/lib/global-store";
import storage from "~/lib/storage";
import { LoginSchema } from "~/schemas/auth.schema";

export class AuthErrors<T> extends AppErrors {
  name = "AuthErrors";
  properties?: { [key in keyof T]?: string };

  constructor(error: AppError, properties?: { [key in keyof T]?: string }) {
    super(error);
    this.properties = properties;
  }

  static readonly InvalidCredentials: AppError = {
    code: "INVALID_CREDENTIALS",
    message: "Email hoặc mật khẩu không chính xác",
  };
  static readonly Unauthorized = {
    code: "UNAUTHORIZED",
    message: "Unauthorized",
  };

  static invalidCredentials() {
    return new AuthErrors<LoginSchema>(this.InvalidCredentials, {
      password: this.InvalidCredentials.message,
    });
  }

  static async unauthorized() {
    useGlobalStore.setState({
      isAuthenticated: false,
      authToken: null,
      userInfo: null,
    });

    // Remove from storage
    await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    await storage.remove(STORAGE_KEYS.USER_INFO);
    return new AuthErrors(this.Unauthorized);
  }
}

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

  await GoogleSignin.signIn();
  const access_token = (await GoogleSignin.getTokens()).accessToken;
  return access_token;
};

const loginWithGoogle = async () => {
  console.log("Logging in with Google");

  try {
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
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) throw await AuthErrors.unauthorized();
    }
    throw error;
  }
};

const getUserInfo = async () => {
  console.log("Getting user info");

  const headers = await api.getHeaders({ withToken: true });
  try {
    const response = await api.request<UserInfo>({
      url: "/auth/user/",
      method: "get",
      config: { headers },
    });
    useGlobalStore.setState({ userInfo: response.data });

    await storage.set(STORAGE_KEYS.USER_INFO, response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 400) throw AuthErrors.invalidCredentials();
      if (error.response?.status === 401) throw await AuthErrors.unauthorized();
    }
    throw error;
  }
};

const logout = async () => {
  console.log("Logging out");

  try {
    useGlobalStore.setState({
      userInfo: null,
      authToken: null,
      isAuthenticated: false,
    });

    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }

    await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    await storage.remove(STORAGE_KEYS.USER_INFO);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

export { getUserInfo, loginWithCreds, loginWithGoogle, logout };
