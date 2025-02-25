import "~/global.css";

import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Platform, View } from "react-native";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { NAV_THEME } from "~/lib/constants";
import { useGlobalStore } from "~/lib/global-store";
import { useColorScheme } from "~/lib/useColorScheme";
import { FullWindowOverlay } from "react-native-screens";
import SplashScreen from "~/app/splash";

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

export default function RootLayout() {
  const { colorScheme, isDarkColorScheme } = useColorScheme();
  const initializeGlobalStore = useGlobalStore(
    (state) => state.initializeGlobalStore
  );
  const isInitialized = useGlobalStore((state) => state.isInitialized);

  useIsomorphicLayoutEffect(() => {
    const initializeRootLayout = async () => {
      console.log("Rerender!");

      if (isInitialized) return;

      if (Platform.OS === "web") {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add("bg-background");
      }

      setAndroidNavigationBar(colorScheme);
      await initializeGlobalStore(2310);
      console.log("Finished initializing!");
    };

    initializeRootLayout();
  }, []);

  if (!isInitialized) return <SplashScreen />;

  return (
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <StatusBar style={isDarkColorScheme ? "light" : "dark"} />

      <Stack
        screenOptions={{
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="menu" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>

      <PortalHost />
    </ThemeProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
