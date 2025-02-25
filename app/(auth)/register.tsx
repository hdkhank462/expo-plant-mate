import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

const RegisterScreen = () => {
  return (
    <View className="flex-1 p-4 pt-10 bg-secondary/30">
      <Text>RegisterScreen</Text>
      <Link href={"/(auth)/login"} replace>
        <Text className="font-bold underline">Đăng nhập</Text>
      </Link>
    </View>
  );
};

export default RegisterScreen;
