import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { AxiosResponse } from "axios";
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
  Initialize: (delayMs?: number) => Promise<void>;
  login: (credentials: LoginSchema) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  //-------------------- Initial state --------------------

  isInitialized: false,
  isAuthenticated: false,
  userInfo: null,
  authToken: null,

  //-------------------- Initialization functions --------------------

  Initialize: async (delayMs?: number) => {
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

    await delay(delayMs ?? 1000);

    set((state) => ({
      isInitialized: true,
    }));
  },

  //-------------------- Authentication functions --------------------

  login: async (credentials: LoginSchema) => {
    try {
      const response = await api.post<any, AxiosResponse<LoginResponse>>(
        "/auth/login/",
        {
          ...credentials,
        }
      );

      await handleLoginResponse(set, response);
    } catch (error) {
      console.error("Error during login:", error);
    }
  },
  loginWithGoogle: async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const signInResponse = await GoogleSignin.signIn();
      if (isSuccessResponse(signInResponse)) {
        // console.log(JSON.stringify(signInResponse, null, 2));

        // get the user's idToken, accessToken and serverAuthCode
        const getTokensResponse = await GoogleSignin.getTokens();
        // console.log(JSON.stringify(getTokensResponse, null, 2));

        // call backend api to authenticate user
        const response = await api.post<any, AxiosResponse<LoginResponse>>(
          "/auth/google/",
          {
            access_token: getTokensResponse.accessToken,
          }
        );

        await handleLoginResponse(set, response);
      } else {
        // sign in was cancelled by user
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            console.log("Operation (eg. sign in) already in progress", error);
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            console.log(
              "Android only, play services not available or outdated",
              error
            );
            break;
          default:
            // some other error happened
            console.log("some other error happened", error);
        }
      } else {
        // an error that's not related to google sign in occurred
      }
    }
  },
  logout: async () => {
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
) => {
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
