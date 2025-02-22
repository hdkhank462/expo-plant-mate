import { View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { Link } from "expo-router";

const ProfileScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-secondary/30">
      <Text>ProfileScreen</Text>
      <Link href={"/(auth)/login"}>
        <Text className="underline font-bold">Đăng nhập</Text>
      </Link>
    </View>
  );
};

export default ProfileScreen;
