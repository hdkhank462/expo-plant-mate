import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

const LoginScreen = () => {
  return (
    <View className="flex-1 p-4 pt-10 center bg-secondary/30">
      <Text>LoginScreen</Text>
      <Link replace href={"/(auth)/register"}>
        <Text className="font-bold underline">Đăng ký</Text>
      </Link>
    </View>
  );
};

export default LoginScreen;
