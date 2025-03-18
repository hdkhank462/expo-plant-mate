import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { create } from "zustand";
import storage from "~/lib/storage";
import { STORAGE_KEYS } from "~/constants/values";

type State = {
  isInitialized: boolean;
  isAuthenticated: boolean;
  isAppLoading: boolean;
  appError?: ErrorObject;
  userInfo: UserInfo | null;
  authToken: AuthToken | null;
  initializeGlobalStore: () => Promise<void>;
  setAppErrorPopupOpen: (value: boolean) => void;
};

export const useStore = create<State>((set, get) => ({
  //-------------------- Initial state --------------------

  isInitialized: false,
  isAuthenticated: false,
  isAppLoading: false,
  appError: undefined,
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

    // const alarms = await getAlarms();

    set((state) => ({
      isInitialized: true,
      // alarms,
    }));
  },

  //-------------------- Error handling --------------------

  setAppErrorPopupOpen: (isOpen) => {
    if (!isOpen) {
      set((state) => ({
        appError: undefined,
      }));
    }
  },
}));
