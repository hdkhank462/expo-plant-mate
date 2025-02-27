import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigation } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { ScrollView, View } from "react-native";
import { AuthErrors, register } from "~/api/auth";
import LogoContainer from "~/app/(auth)/_components/_LogoContainer";
import { useErrorPopup } from "~/components/ErrorPopupBoundary";
import GoogleLoginButton from "~/components/GoogleLoginButton";
import Separator from "~/components/Separator";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { AppErrors } from "~/lib/errors";
import { useGlobalStore } from "~/lib/global-store";
import { catchErrorTyped } from "~/lib/utils";
import { registerSchema, RegisterSchema } from "~/schemas/auth.schema";

const RegisterScreen = () => {
  const scrollRef = React.useRef<ScrollView>(null);

  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <LogoContainer />
      <View className="gap-4">
        <Text className="text-2xl font-bold text-center">
          Đăng ký tài khoản
        </Text>
        <FormContainer />
        <Separator label="hoặc" />
        <GoogleLoginButton>Tiếp tục với Google</GoogleLoginButton>
      </View>
    </ScrollView>
  );
};

const FormContainer = () => {
  const navigation = useNavigation();
  const { showErrorPopup } = useErrorPopup();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterSchema) => {
    useGlobalStore.setState({ isAppLoading: true });

    const [error] = await catchErrorTyped(register(values), [
      AuthErrors,
      AppErrors,
    ]);

    if (error) {
      form.setValue("password", "");
      form.setValue("confirmPassword", "");

      if (error instanceof AuthErrors) {
        if (error.properties?.email) {
          form.setError("email", { message: error.properties.email[0] });
        }
        if (error.properties?.password) {
          form.setError("confirmPassword", {
            message: error.properties.password[0],
          });
        }
      } else if (error instanceof AppErrors) {
        let errors = "";
        if (Array.isArray(error.cause)) {
          errors = error.cause.join("\n");
        }

        showErrorPopup({ message: errors });
      } else {
        showErrorPopup();
      }
    } else {
      navigation.goBack();
    }

    useGlobalStore.setState({ isAppLoading: false });
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormInput
              label="Xác nhận mật khẩu"
              placeholder="Xác nhận mật khẩu của bạn"
              password
              required
              {...field}
            />
          )}
        />
        <LinksContainer />
        <Button onPress={form.handleSubmit(onSubmit)}>
          <Text className="font-bold">Đăng ký</Text>
        </Button>
      </View>
    </Form>
  );
};

const LinksContainer = () => {
  return (
    <View className="flex-row gap-1">
      <Text className="text-sm">Đã có tài khoản?</Text>
      <Link href={"/(auth)/login"} replace>
        <Text className="text-sm font-bold underline ">Đăng nhập</Text>
      </Link>
    </View>
  );
};

export default RegisterScreen;
