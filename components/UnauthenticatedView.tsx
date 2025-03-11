import { View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { Link } from "expo-router";
import { Button } from "~/components/ui/button";

const UnauthenticatedView = () => {
  return (
    <View className="items-center justify-center h-full gap-6">
      <View className="items-center justify-center w-full">
        {/* <Text className="mb-4 text-4xl font-bold">401</Text> */}
        <Text className="text-muted-foreground">
          Bạn chưa đăng nhập vào ứng dụng
        </Text>
        <Text className="text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href={"/(auth)/register"} asChild>
            <Text className="font-bold underline text-primary">
              Đăng ký ngay
            </Text>
          </Link>
        </Text>
      </View>

      <Link href={"/(auth)/login"} asChild>
        <Button size={"sm"} className="shadow-sm shadow-foreground/5">
          <Text className="font-bold">Đăng nhập để tiếp tục</Text>
        </Button>
      </Link>
    </View>
  );
};

export default UnauthenticatedView;
