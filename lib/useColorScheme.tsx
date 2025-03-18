import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";
import { DEFAULT, STORAGE_KEYS } from "~/lib/constants";
import { useStore } from "~/stores/index";
import storage from "~/lib/storage";

export function useColorScheme() {
  const { colorScheme, setColorScheme, toggleColorScheme } =
    useNativewindColorScheme();
  const isInitialized = useStore((state) => state.isInitialized);

  // Load the color scheme from AsyncStorage when the component mounts
  useEffect(() => {
    const loadColorScheme = async () => {
      if (isInitialized) return;

      const storedTheme = await storage.get<AppTheme>(
        STORAGE_KEYS.COLOR_SCHEME
      );

      if (storedTheme) {
        console.log("Loading color scheme to", storedTheme);
        setColorScheme(storedTheme);
      }
    };

    loadColorScheme();
  }, []);

  // Save the color scheme to AsyncStorage whenever it changes
  useEffect(() => {
    const saveColorScheme = async () => {
      if (isInitialized && colorScheme) {
        const storedColorScheme = await storage.get<AppTheme>(
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
    colorScheme: colorScheme ?? DEFAULT.APP_THEME,
    isDarkColorScheme: colorScheme === "dark",
    setColorScheme,
    toggleColorScheme,
  };
}
