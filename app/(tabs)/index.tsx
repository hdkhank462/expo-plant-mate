import React from "react";
import { SafeAreaView, View } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Text } from "~/components/ui/text";

const HomeScreen = () => {
  return (
    <SafeAreaView className="h-full bg-secondary">
      <View className="p-4">
        <Text className="text-lg font-bold">Home</Text>
        <ThemeToggle />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
