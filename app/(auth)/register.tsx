import { View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { Link } from "expo-router";

const RegisterScreen = () => {
  return (
    <View className="flex-1 p-4 pt-10 bg-secondary/30">
      <Text>RegisterScreen</Text>
      <Link replace href={"/(auth)/login"}>
        <Text className="underline font-bold">Đăng nhập</Text>
      </Link>
    </View>
  );
};

export default RegisterScreen;
