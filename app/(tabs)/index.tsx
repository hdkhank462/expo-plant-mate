import React from "react";
import { View } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Text } from "~/components/ui/text";

const HomeScreen = () => {
  return (
    <View className="items-center justify-center flex-1 p-4 bg-secondary/30">
      <View className="w-full h-full">
        <Text className="text-lg font-bold">Home</Text>
        <ThemeToggle />
      </View>
    </View>
  );
};

export default HomeScreen;
