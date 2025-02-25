import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { AxiosError, AxiosResponse } from "axios";
import { create } from "zustand";
import storage from "~/lib/storage";
import { STORAGE_KEYS } from "./constants";

type GlobalStore = {
  isInitialized: boolean;
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  authToken: AuthToken | null;
  initializeGlobalStore: () => Promise<void>;
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  //-------------------- Initial state --------------------

  isInitialized: false,
  isAuthenticated: false,
  userInfo: null,
  authToken: null,

  //-------------------- Initialization functions --------------------

  initializeGlobalStore: async () => {
    console.log("Initializing global store");
    GoogleSignin.configure();

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

    set((state) => ({
      isInitialized: true,
    }));
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

const handleAxiosError = (error: AxiosError) => {
  if (error.code === AxiosError.ERR_NETWORK) {
    return "Không thể kết nối đến máy chủ.\nVui lòng kiểm tra kết nối mạng và thử lại.";
  }

  if (error.response) {
    if (error.response.status === 400) {
      return "Email hoặc mật khẩu không chính xác";
    }
  }

  return "Lỗi không xác định";
};
