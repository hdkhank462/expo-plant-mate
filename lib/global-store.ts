import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import axios, { AxiosError, AxiosResponse, isAxiosError } from "axios";
import { create } from "zustand";
import api from "~/lib/axios.config";
import storage from "~/lib/storage";
import { LoginSchema } from "~/schemas/auth.schema";
import { STORAGE_KEYS } from "./constants";
import { delay } from "./utils";

type GlobalStore = {
  isInitialized: boolean;
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  authToken: AuthToken | null;
  initializeGlobalStore: (delayMs?: number) => Promise<void>;
  login: (credentials: LoginSchema) => Promise<ApiResponse<LoginError>>;
  loginWithGoogle: () => Promise<ApiResponse<LoginError>>;
  logout: () => Promise<void>;
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  //-------------------- Initial state --------------------

  isInitialized: false,
  isAuthenticated: false,
  userInfo: null,
  authToken: null,

  //-------------------- Initialization functions --------------------

  initializeGlobalStore: async (delayMs?: number) => {
    console.log("Initializing global store");
    GoogleSignin.configure();

    const authToken = await storage.get<AuthToken>(STORAGE_KEYS.AUTH_TOKEN);
    if (authToken) {
      try {
        const response = await api.get<any, AxiosResponse<UserInfo>>(
          "/auth/user/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken.access}`,
            },
          }
        );

        if (response.status !== 200) {
          console.log("Get user info failed:", response);
          throw new Error("Get user info failed");
        }

        set((state) => ({
          userInfo: response.data,
          authToken,
          isAuthenticated: true,
        }));
      } catch (error) {
        console.error("Error during get user info:", error);
      }
    }

    // If not connected to the internet
    const userInfo = await storage.get<UserInfo>(STORAGE_KEYS.USER_INFO);
    if (userInfo) {
      set((state) =>
        state.isAuthenticated
          ? {}
          : {
              userInfo: userInfo as UserInfo,
              isAuthenticated: true,
            }
      );
    }

    if (delayMs) await delay(delayMs);

    set((state) => ({
      isInitialized: true,
    }));
  },

  //-------------------- Authentication functions --------------------

  login: async (credentials: LoginSchema): Promise<ApiResponse<LoginError>> => {
    console.log("Logining with credentials:", credentials);
    let isSuccess = false;
    let error: LoginError | undefined;

    try {
      const response = await api.post<any, AxiosResponse<LoginResponse>>(
        "/auth/login/",
        {
          ...credentials,
        }
      );

      await handleLoginResponse(set, response);
      isSuccess = true;
    } catch (e: unknown) {
      console.log("Error during login with credentials:", e);

      if (axios.isAxiosError(e)) {
        switch (e.code) {
          case AxiosError.ERR_BAD_REQUEST:
            error = {
              non_field_errors:
                "Email hoặc mật khẩu không chính xác.\nVui lòng thử lại.",
            };
            break;
          default:
            break;
        }
      }
    } finally {
      console.log({ isSuccess, error });
      return { isSuccess, error };
    }
  },
  loginWithGoogle: async (): Promise<ApiResponse<LoginError>> => {
    console.log("Logining with Google");
    let isSuccess = false;
    let error: LoginError | undefined;

    try {
      await GoogleSignin.hasPlayServices();

      const signInResponse = await GoogleSignin.signIn();
      if (isSuccessResponse(signInResponse)) {
        const getTokensResponse = await GoogleSignin.getTokens();

        // call backend api to authenticate user
        const response = await api.post<any, AxiosResponse<LoginResponse>>(
          "/auth/google/",
          {
            access_token: getTokensResponse.accessToken,
          }
        );

        await handleLoginResponse(set, response);
        isSuccess = true;
      } else console.log("User cancelled the login flow");
    } catch (e: unknown) {
      console.log("Error during login with Google:", e);

      if (isErrorWithCode(e)) {
        switch (e.code) {
          case statusCodes.IN_PROGRESS:
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            break;
          default:
            break;
        }
      }
    } finally {
      console.log({ isSuccess, error });
      return { isSuccess, error };
    }
  },
  logout: async () => {
    console.log("Logging out");

    try {
      set((state) => ({
        userInfo: null,
        authToken: null,
        isAuthenticated: false,
      }));

      if (GoogleSignin.hasPreviousSignIn()) {
        await GoogleSignin.signOut();
      }

      await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      await storage.remove(STORAGE_KEYS.USER_INFO);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },
}));

const handleLoginResponse = async (
  set: (
    partial:
      | GlobalStore
      | Partial<GlobalStore>
      | ((state: GlobalStore) => GlobalStore | Partial<GlobalStore>),
    replace?: boolean | undefined
  ) => void,
  response: AxiosResponse<LoginResponse>
): Promise<void> => {
  if (response.status !== 200) {
    console.log("Login failed:", response);
    throw new Error("Login failed");
  }

  console.log("Login successful:", JSON.stringify(response.data, null, 2));

  set((state) => ({
    userInfo: response.data.user,
    authToken: {
      access: response.data.access,
      refresh: response.data.refresh,
    },
    isAuthenticated: true,
  }));

  await storage.set(STORAGE_KEYS.AUTH_TOKEN, {
    access: response.data.access,
    refresh: response.data.refresh,
  });

  await storage.set(STORAGE_KEYS.USER_INFO, response.data.user);
};
