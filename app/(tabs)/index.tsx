import { View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { ThemeToggle } from "~/components/ThemeToggle";

const HomeScreen = () => {
  return (
    <View className="flex-1 items-center p-4 justify-center bg-secondary/30">
      <View className="w-full h-full">
        <Text className="text-lg font-bold">Home</Text>
        <ThemeToggle />
      </View>
    </View>
  );
};

export default HomeScreen;
