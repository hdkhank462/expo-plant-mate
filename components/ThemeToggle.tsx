import { Pressable, View } from "react-native";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { Switch } from "~/components/ui/switch";
import { useState } from "react";

export function ThemeToggle({
  swtich,
  className,
}: {
  className?: string;
  swtich?: boolean;
}) {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const [checked, setChecked] = useState(isDarkColorScheme);

  function toggleColorScheme() {
    const newTheme = isDarkColorScheme ? "light" : "dark";
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);

    if (swtich) setChecked((prev) => (prev = !prev));
  }

  if (swtich)
    return <Switch checked={checked} onCheckedChange={toggleColorScheme} />;
  else
    return (
      <Button
        onPress={toggleColorScheme}
        variant="ghost"
        size="icon"
        className={cn(
          "mr-3 web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2",
          className
        )}
      >
        <View className="items-center justify-center flex-1 aspect-square">
          {isDarkColorScheme ? (
            <MoonStar
              className="text-foreground"
              size={23}
              strokeWidth={1.25}
            />
          ) : (
            <Sun className="text-foreground" size={24} strokeWidth={1.25} />
          )}
        </View>
      </Button>
    );
}
