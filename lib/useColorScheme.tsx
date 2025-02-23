import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";
import { STORAGE_KEYS } from "~/lib/constants";
import { useGlobalStore } from "~/lib/global-store";
import storage from "~/lib/storage";

type ColorScheme = "light" | "dark" | "system";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  const isInitialized = useGlobalStore((state) => state.isInitialized);

  // Load the color scheme from AsyncStorage when the component mounts
  useEffect(() => {
    const loadColorScheme = async () => {
      if (isInitialized) return;

      const storedColorScheme = await storage.get<ColorScheme>(
        STORAGE_KEYS.COLOR_SCHEME
      );

      if (storedColorScheme) {
        console.log("Setting color scheme to", storedColorScheme);
        setColorScheme(storedColorScheme);
      }
    };

    loadColorScheme();
  }, []);

  // Save the color scheme to AsyncStorage whenever it changes
  useEffect(() => {
    const saveColorScheme = async () => {
      if (isInitialized && colorScheme) {
        const storedColorScheme = await storage.get<ColorScheme>(
          STORAGE_KEYS.COLOR_SCHEME
        );

        if (storedColorScheme !== colorScheme) {
          console.log("Setting color scheme to", colorScheme);
          await storage.set(STORAGE_KEYS.COLOR_SCHEME, colorScheme);
        }
      }
    };

    saveColorScheme();
  }, [colorScheme]);

  return {
    colorScheme: colorScheme ?? "light",
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}
