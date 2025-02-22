import { View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { Link } from "expo-router";

const LoginScreen = () => {
  return (
    <View className="flex-1 center p-4 pt-10 bg-secondary/30">
      <Text>LoginScreen</Text>
      <Link replace href={"/(auth)/register"}>
        <Text className="underline font-bold">Đăng ký</Text>
      </Link>
    </View>
  );
};

export default LoginScreen;
