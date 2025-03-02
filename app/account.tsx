import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, View } from "react-native";
import { AccountErrors, changePassword, updateAccount } from "~/api/account";
import { getUserInfo } from "~/api/auth";
import CardWithTitle from "~/components/CardWithTitle";
import EmailVerificationForm from "~/components/EmailVerificationForm";
import { usePopup } from "~/components/PopupProvider";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { AppErrors } from "~/lib/errors";
import { useGlobalStore } from "~/lib/global-store";
import { catchErrorTyped } from "~/lib/utils";
import {
  changePasswordSchema,
  ChangePasswordSchema,
  setPasswordSchema,
  SetPasswordSchema,
  updateAccountSchema,
  UpdateAccountSchema,
} from "~/schemas/account.schema";

const AccountSettingsScreen = () => {
  const scrollRef = React.useRef<ScrollView>(null);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const navigation = useNavigation();

  useEffect(() => {
    const init = async () => {
      useGlobalStore.setState({ isAppLoading: true });

      const [error, response] = await catchErrorTyped(getUserInfo(), [
        AppErrors,
      ]);

      if (error) {
        navigation.goBack();
      } else if (response) {
        setUserInfo(response);
      }

      useGlobalStore.setState({ isAppLoading: false });
    };
    init();
  }, []);

  if (!userInfo) return null;

  return (
    <SafeAreaView className="h-full bg-secondary/30">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4"
      >
        <View className="gap-4">
          <CardWithTitle title="Thông tin tài khoản">
            <UpdateAccountForm userInfo={userInfo} />
          </CardWithTitle>
          <CardWithTitle title="Xác thực email">
            <EmailVerificationForm userInfo={userInfo} />
          </CardWithTitle>
          <CardWithTitle title="Đổi mật khẩu">
            <ChangePasswordForm />
          </CardWithTitle>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ChangePasswordForm = () => {
  const popup = usePopup();
  const form = useForm<SetPasswordSchema>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: ChangePasswordSchema) => {
    console.log("Submit values:", values);
    const schema = changePasswordSchema.parse(values);

    useGlobalStore.setState({ isAppLoading: true });

    const [error] = await catchErrorTyped(changePassword(schema), [
      AccountErrors<ChangePasswordSchema>,
    ]);

    if (error) {
      form.setValue("newPassword", "");
      form.setValue("confirmNewPassword", "");

      if (error instanceof AccountErrors) {
        const newPasswordError = Array.isArray(error.properties?.newPassword)
          ? error.properties.newPassword[0]
          : error.properties?.newPassword;
        const confirmNewPasswordError = Array.isArray(
          error.properties?.confirmNewPassword
        )
          ? error.properties.confirmNewPassword[0]
          : error.properties?.confirmNewPassword;

        if (newPasswordError)
          form.setError("newPassword", {
            message: newPasswordError,
          });
        if (confirmNewPasswordError)
          form.setError("confirmNewPassword", {
            message: confirmNewPasswordError,
          });
      } else {
        popup.error();
      }
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  return (
    <Form {...form}>
      <View className="gap-2">
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
        <View className="flex-row justify-end">
          <Button size={"sm"} onPress={form.handleSubmit(onSubmit)}>
            <Text className="font-bold">Đổi mật khẩu</Text>
          </Button>
        </View>
      </View>
    </Form>
  );
};

const UpdateAccountForm = ({ userInfo, ...props }: { userInfo: UserInfo }) => {
  const popup = usePopup();
  const form = useForm<UpdateAccountSchema>({
    resolver: zodResolver(updateAccountSchema),
    defaultValues: {
      //   avatarUrl: userInfo?.avatar_url,
      firstName: userInfo.first_name ?? "",
      lastName: userInfo.last_name ?? "",
    },
  });

  const onSubmit = async (values: UpdateAccountSchema) => {
    console.log("Submit values:", values);
    const schema = updateAccountSchema.parse(values);

    useGlobalStore.setState({ isAppLoading: true });

    const [error] = await catchErrorTyped(updateAccount(schema), [
      AccountErrors,
    ]);

    if (error) {
      if (error instanceof AccountErrors) {
        // TODO: set form errors
      } else {
        popup.error();
      }
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  return (
    <Form {...form}>
      <View className="gap-2">
        {/* <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => <FormInput {...field} />}
        /> */}
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormInput
              label="Họ"
              placeholder="Họ của bạn"
              required
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormInput
              label="Tên"
              placeholder="Tên của bạn"
              required
              {...field}
            />
          )}
        />
        <View className="flex-row justify-end">
          <Button size={"sm"} onPress={form.handleSubmit(onSubmit)}>
            <Text className="font-bold">Cập nhật</Text>
          </Button>
        </View>
      </View>
    </Form>
  );
};

export default AccountSettingsScreen;
