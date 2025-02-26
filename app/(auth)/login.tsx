import { Link, useNavigation } from "expo-router";
import React, { useEffect } from "react";
import { Image, View } from "react-native";
import Toast from "react-native-toast-message";
import { AuthErrors, loginWithCreds, loginWithGoogle } from "~/api/auth";
import { useErrorPopup } from "~/components/ErrorPopupBoundary";
import FormField from "~/components/FormField";
import GoogleLoginButton from "~/components/GoogleLoginButton";
import { Button } from "~/components/ui/button";
import { DialogTrigger } from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { ApiErrors } from "~/lib/axios.config";
import { useGlobalStore } from "~/lib/global-store";
import { catchErrorTyped } from "~/lib/utils";
import { loginSchema, LoginSchema } from "~/schemas/auth.schema";

const DEFAULT_LOGIN_FORM: LoginSchema = {
  email: "",
  password: "",
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const { showErrorPopup: setErrorPopup } = useErrorPopup();

  const handleGoogleLogin = async () => {
    useGlobalStore.setState({ isAppLoading: true });

    const [error] = await catchErrorTyped(loginWithGoogle(), [
      AuthErrors,
      ApiErrors,
    ]);
    if (error === undefined) {
      navigation.goBack();
    } else if (error instanceof ApiErrors) {
      // Toast.show({
      //   type: "error",
      //   text1: "Thông báo",
      //   text2: error.message,
      // });
      setErrorPopup({ message: error.message });
    } else {
      setErrorPopup();
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  return (
    <View className="flex-1 pt-7 bg-secondary/30">
      <View className="gap-6 p-4">
        <LogoAndTitleView />
        <FormView />
        <LinksContainer />
        <GoogleLoginButton onPress={handleGoogleLogin} />
      </View>
    </View>
  );
};

const LogoAndTitleView = () => {
  return (
    <View className="items-center">
      <Image
        className="h-32 aspect-square"
        source={require("~/assets/images/logo/adaptive-icon/foreground.png")}
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold">Đăng nhập tài khoản</Text>
    </View>
  );
};

const FormView = () => {
  const navigation = useNavigation();
  const [form, setForm] = React.useState<LoginSchema>(DEFAULT_LOGIN_FORM);
  const [formErrors, setFormErrors] =
    React.useState<{ [key in keyof LoginSchema]?: string }>();
  const { showErrorPopup: setErrorPopup } = useErrorPopup();

  useEffect(() => {
    if (formErrors?.password) {
      setForm((prev) => ({ ...prev, password: "" }));
    }
  }, [formErrors]);

  const validateForm = (form: LoginSchema): boolean => {
    const isValid = loginSchema.safeParse(form);

    if (!isValid.success) {
      const fieldErrors = isValid.error.formErrors.fieldErrors;
      setFormErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
    }

    return isValid.success;
  };

  const validateField = (field: keyof LoginSchema, value: string): void => {
    const result = loginSchema.shape[field].safeParse(value);

    if (!result.success) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [field]: result.error.errors[0].message,
      }));
      if (field === "password") {
        setForm((prevForm) => ({ ...prevForm, password: "" }));
      }
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [field]: undefined,
      }));
    }
  };

  const handleLogin = async () => {
    const isValid = validateForm(form);
    if (!isValid) return;

    useGlobalStore.setState({ isAppLoading: true });

    const [error] = await catchErrorTyped(loginWithCreds(form), [
      AuthErrors<LoginSchema>,
      ApiErrors,
    ]);
    if (error === undefined) {
      navigation.goBack();
    } else if (error instanceof ApiErrors) {
      setErrorPopup({ message: error.message });
    } else if (error instanceof AuthErrors) {
      setFormErrors(error.properties);
    } else {
      setErrorPopup();
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  return (
    <View className="gap-2">
      <FormField
        value={form.email}
        errorMessage={formErrors?.email}
        onChangeText={(text) => {
          const updatedForm: LoginSchema = { ...form, email: text };
          setForm(updatedForm);
          validateField("email", text);
        }}
        nativeID="email"
        title="Địa chỉ email"
        placeholder="Email của bạn"
        keyboardType="email-address"
        required
      />

      <FormField
        value={form.password}
        errorMessage={formErrors?.password}
        onChangeText={(text) => {
          const updatedForm = { ...form, password: text };
          setForm(updatedForm);
          validateField("password", text);
        }}
        nativeID="password"
        title="Mật khẩu"
        placeholder="Mật khẩu của bạn"
        password
        required
      />
      <Button onPress={handleLogin}>
        <Text className="font-bold">Đăng nhập</Text>
      </Button>
    </View>
  );
};

const LinksContainer = () => {
  return (
    <View className="flex-row justify-between">
      <Link href={"/(auth)/register"} replace>
        <Text className="text-sm font-bold underline ">Đăng ký tài khoản</Text>
      </Link>
      <Link href={"/(auth)/register"} replace>
        <Text className="text-sm font-bold underline">Quên mật khẩu?</Text>
      </Link>
    </View>
  );
};

export default LoginScreen;
