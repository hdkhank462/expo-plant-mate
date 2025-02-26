import { GoogleSignin } from "@react-native-google-signin/google-signin";
import api, { ApiErrors } from "~/lib/axios.config";
import { STORAGE_KEYS } from "~/lib/constants";
import { AppErrors } from "~/lib/errors";
import { useGlobalStore } from "~/lib/global-store";
import storage from "~/lib/storage";
import { LoginSchema } from "~/schemas/auth.schema";

export class AuthErrors<T> extends AppErrors {
  name = "AuthErrors";
  properties?: { [key in keyof T]?: string };

  constructor(error?: AppError, properties?: { [key in keyof T]?: string }) {
    super(error);
    this.properties = properties;
  }

  static InvalidCredentials: AppError = {
    code: "INVALID_CREDENTIALS",
    message: "Email hoặc mật khẩu không chính xác",
  };
  static Unauthorized = {
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

  const response = await api.post<LoginResponse>("/auth/login/", schema);

  if (response.status === 400) throw AuthErrors.invalidCredentials();

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

const getGoogleTokens = async () => {
  await GoogleSignin.signIn();
  const access_token = (await GoogleSignin.getTokens()).accessToken;
  return access_token;
};

const loginWithGoogle = async () => {
  console.log("Logging in with Google");

  const access_token = await getGoogleTokens();
  const response = await api.post<LoginResponse>("/auth/google/", {
    access_token,
  });

  if (response.status === 400) throw AuthErrors.invalidCredentials();
  if (response.status === 401) throw AuthErrors.unauthorized();

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

  const headers = await api.getHeaders({ withToken: true });
  const response = await api.get<UserInfo>("/auth/user", { headers });

  if (response.status === 400) throw AuthErrors.invalidCredentials();
  if (response.status === 401) throw AuthErrors.unauthorized();

  useGlobalStore.setState({ userInfo: response.data });

  await storage.set(STORAGE_KEYS.USER_INFO, response.data);
  return response.data;
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
