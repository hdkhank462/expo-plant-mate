import { Link } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import LogoContainer from "~/app/(auth)/_components/_LogoContainer";
import EmailVerificationForm from "~/components/EmailVerificationForm";
import { Text } from "~/components/ui/text";

const PasswordResetScreen = () => {
  const scrollRef = React.useRef<ScrollView>(null);

  return (
    <SafeAreaView className="h-full bg-secondary/30 pt-7">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4"
      >
        <LogoContainer />
        <View className="gap-4">
          <Text className="text-2xl font-bold text-center">Quên mật khẩu</Text>
          <EmailVerificationForm className="gap-4" isPasswordReset={true} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PasswordResetScreen;
