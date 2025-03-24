import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Platform } from "react-native";
import LoadingOverlay from "~/components/LoadingOverlay";
import { PopupProvider } from "~/components/PopupProvider";
import { ToastProvider } from "~/components/ui/toast";
import { NAV_THEME } from "~/lib/constants";
import { useStore } from "~/stores/index";
import { useColorScheme } from "~/lib/useColorScheme";
import * as Notifications from "expo-notifications";
import { useNofiications } from "~/hooks/useNofications";

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const initializeGlobalStore = useStore(
    (state) => state.initializeGlobalStore
  );
  const isInitialized = useStore((state) => state.isInitialized);
  const isAppLoading = useStore((state) => state.isAppLoading);
  const [isAppReady, setisAppReady] = useState(false);

  const { channels, expoPushToken, notification } = useNofiications();

  useIsomorphicLayoutEffect(() => {
    const initializeRootLayout = async () => {
      console.log("Preparing app...");

      if (isAppReady) return;

      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }

      // Set the Android navigation bar color.
      // setAndroidNavigationBar(colorScheme);

      // Initialize the global store.
      if (!isInitialized) await initializeGlobalStore();

      // Wait for the splash screen to finish.
      // await delay(2310);

      setisAppReady(true);
      SplashScreen.hideAsync();
      console.log("App is ready!");
    };

    initializeRootLayout();
  }, []);

  if (!isAppReady) return null;

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />

      <PopupProvider>
        <Stack
          screenOptions={{
            animation: "fade_from_bottom",
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="account"
            options={{
              title: "Cập nhật thông tin tài khoản",
              headerTitleAlign: "center",
              headerShown: true,
            }}
          />
          <Stack.Screen
            name="search/[query]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="plants/[id]"
            options={{ title: "Chi tiết cây", headerTitleAlign: "center" }}
          />
          <Stack.Screen
            name="plant-cares/create"
            options={{
              title: "Thêm lịch chăm sóc",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="plant-cares/[id]"
            options={{
              title: "Chi tiết lịch chăm sóc",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: "Cài đặt",
              headerTitleAlign: "center",
            }}
          />
          <Stack.Screen name="tflite" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </PopupProvider>

      {isAppLoading && <LoadingOverlay />}
      <ToastProvider />
      <PortalHost />
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
