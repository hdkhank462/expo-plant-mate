import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigation, useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, View } from "react-native";
import { AuthErrors, loginWithCreds } from "~/api/auth";
import LogoContainer from "~/app/(auth)/_components/_LogoContainer";
import { usePopup } from "~/components/PopupProvider";
import GoogleLoginButton from "~/components/GoogleLoginButton";
import Separator from "~/components/Separator";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { AppErrors } from "~/lib/errors";
import { useStore } from "~/stores/index";
import { catchErrorTyped } from "~/lib/utils";
import { loginSchema, LoginSchema } from "~/schemas/auth.schema";

const DEFAULT_LOGIN_FORM: LoginSchema = {
  email: "",
  password: "",
};

const LoginScreen = () => {
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
            Đăng nhập tài khoản
          </Text>
          <FormContainer />
          <Separator label="hoặc" />
          <GoogleLoginButton />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const FormContainer = () => {
  const router = useRouter();
  const popup = usePopup();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: DEFAULT_LOGIN_FORM,
  });

  const onSubmit = async (values: LoginSchema) => {
    useStore.setState({ isAppLoading: true });

    const [error, data] = await catchErrorTyped(loginWithCreds(values), [
      AuthErrors,
      AppErrors,
    ]);

    if (error) {
      form.setValue("password", "");
      if (error instanceof AuthErrors)
        // TODO: Handle email not verified
        popup.error({ description: error.message });
      else popup.error();
    } else if (!!data) {
      router.replace("/(tabs)/profile");
    }

    useStore.setState({ isAppLoading: false });
  };

  return (
    <Form {...form}>
      <View className="gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormInput
              label="Địa chỉ email"
              placeholder="Email của bạn"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              required
              {...field}
            />
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormInput
              label="Mật khẩu"
              placeholder="Mật khẩu của bạn"
              password
              required
              {...field}
            />
          )}
        />
        <LinksContainer />
        <Button onPress={form.handleSubmit(onSubmit)}>
          <Text className="font-bold">Đăng nhập</Text>
        </Button>
      </View>
    </Form>
  );
};

const LinksContainer = () => {
  return (
    <View className="flex-row justify-between">
      <View className="flex-row gap-1">
        <Text className="text-sm">Chưa có tài khoản?</Text>
        <Link href={"/(auth)/register"} replace>
          <Text className="text-sm font-bold underline ">Đăng ký ngay</Text>
        </Link>
      </View>
      <Link href={"/(auth)/password-reset"}>
        <Text className="text-sm font-bold underline">Quên mật khẩu?</Text>
      </Link>
    </View>
  );
};

export default LoginScreen;
