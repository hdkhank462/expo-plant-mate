import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView } from "react-native";

const AuthLayout = () => {
  const scrollRef = React.useRef<ScrollView>(null);

  return (
    <SafeAreaView className="min-h-full p-4 bg-background pt-7">
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack>
    </SafeAreaView>
  );
};

export default AuthLayout;
