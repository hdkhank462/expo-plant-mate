import { Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade_from_bottom",
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="password-reset" />
      <Stack.Screen name="password-reset-confirm/[token]" />
    </Stack>
  );
};

export default AuthLayout;
