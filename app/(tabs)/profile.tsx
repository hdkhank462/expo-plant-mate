import { Link } from "expo-router";
import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

const ProfileScreen = () => {
  return (
    <View className="items-center justify-center flex-1 bg-secondary/30">
      <Text>ProfileScreen</Text>
      <Link href={"/(auth)/login"}>
        <Text className="font-bold underline">Đăng nhập</Text>
      </Link>
    </View>
  );
};

export default ProfileScreen;
