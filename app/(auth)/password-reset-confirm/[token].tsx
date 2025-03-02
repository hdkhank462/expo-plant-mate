import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import LogoContainer from "~/app/(auth)/_components/_LogoContainer";
import { usePopup } from "~/components/PopupProvider";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { useForm } from "react-hook-form";
import {
  ChangePasswordSchema,
  resetPasswordConfirmSchema,
  ResetSetPasswordConfirmSchema,
} from "~/schemas/account.schema";
import { useGlobalStore } from "~/lib/global-store";
import { catchErrorTyped } from "~/lib/utils";
import { loginWithCreds } from "~/api/auth";
import { AccountErrors, resetPasswordConfirm } from "~/api/account";
import { getErrorsString } from "~/lib/errors";

const PasswordResetConfirm = () => {
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
          <Text className="text-2xl font-bold text-center">
            Đặt lại mật khẩu mật khẩu
          </Text>
          <ResetPasswordConfirmForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ResetPasswordConfirmForm = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { token } = useLocalSearchParams();
  const isValidToken = typeof token === "string" && token !== "[token]";
  if (!isValidToken) {
    navigation.goBack();
    return;
  }
  const temp = token.split(";");
  const uid = temp[0];
  const tokenValue = temp[1];

  const form = useForm<ResetSetPasswordConfirmSchema>({
    resolver: zodResolver(resetPasswordConfirmSchema),
    defaultValues: {
      uid: uid,
      token: tokenValue,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: ResetSetPasswordConfirmSchema) => {
    console.log("Submit values:", values);
    const schema = resetPasswordConfirmSchema.parse(values);

    useGlobalStore.setState({ isAppLoading: true });

    const [error] = await catchErrorTyped(resetPasswordConfirm(schema), [
      AccountErrors<ChangePasswordSchema>,
    ]);

    if (error) {
      form.setValue("newPassword", "");
      form.setValue("confirmNewPassword", "");

      if (error.code === AccountErrors.InvalidToken.code) {
        navigation.goBack();
        return;
      }

      const errorsString = getErrorsString(error.properties);
      if (errorsString.newPassword)
        form.setError("newPassword", {
          message: errorsString.newPassword,
        });
      if (errorsString.confirmNewPassword)
        form.setError("confirmNewPassword", {
          message: errorsString.confirmNewPassword,
        });
    } else {
      router.replace("/(auth)/login");
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  return (
    <Form {...form}>
      <View className="gap-4">
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormInput
              label="Mật khẩu mới"
              placeholder="Mật khẩu mới của bạn"
              password
              required
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormInput
              label="Xác nhận mật khẩu mới"
              placeholder="Xác nhận mật khẩu mới của bạn"
              password
              required
              {...field}
            />
          )}
        />
        <Button onPress={form.handleSubmit(onSubmit)}>
          <Text className="font-bold">Đặt mật khẩu</Text>
        </Button>
      </View>
    </Form>
  );
};

export default PasswordResetConfirm;
