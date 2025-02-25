import { Link, useNavigation } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import FormField from "~/components/FormField";
import GoogleLoginButton from "~/components/GoogleLoginButton";
import LoadingOverlay from "~/components/LoadingOverlay";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { useGlobalStore } from "~/lib/global-store";
import { loginSchema, LoginSchema } from "~/schemas/auth.schema";

const DEFAULT_LOGIN_FORM: LoginSchema = {
  email: "",
  password: "",
};

const LoginScreen = () => {
  const loginWithGoogle = useGlobalStore((state) => state.loginWithGoogle);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = React.useState(false);
  const [form, setForm] = React.useState<LoginSchema>(DEFAULT_LOGIN_FORM);
  const [errors, setErrors] = React.useState<LoginError>();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const response = await loginWithGoogle();
    setIsLoading(false);

    if (!response.isSuccess) {
      setErrors(response.error);
      setIsErrorDialogOpen(true);
      return;
    }
    navigation.goBack();
    console.log("Logged in with Google!");
  };

  return (
    <View className="flex-1 pt-6 bg-secondary/30">
      <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <View className="relative h-full">
          <View className="justify-center h-full p-4 pt-6">
            <View className="gap-6">
              <LogoAndTitleView />
              <FormView
                form={form}
                errors={errors}
                setForm={setForm}
                setErrors={setErrors}
                setIsLoading={setIsLoading}
                setIsErrorDialogOpen={setIsErrorDialogOpen}
              />
              <LinksView />
              <GoogleLoginButton onPress={handleGoogleLogin} />
            </View>
          </View>

          {isLoading && <LoadingOverlay />}
        </View>
        <DialogContent className="min-w-[16rem] sm:max-w-[425px] p-4">
          <DialogHeader>
            <DialogTitle>Thông báo</DialogTitle>
            <DialogDescription>
              <Text className="text-sm text-muted-foreground">
                {errors?.non_field_errors ??
                  "Lỗi không xác định.\nVui lòng kiểm tra lại kết nối internet và thử lại."}
              </Text>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button size={"sm"}>
                <Text>OK</Text>
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

interface FormViewProps {
  form: LoginSchema;
  errors?: LoginError;
  setForm: (value: React.SetStateAction<LoginSchema>) => void;
  setErrors: (value: React.SetStateAction<LoginError | undefined>) => void;
  setIsLoading: (value: React.SetStateAction<boolean>) => void;
  setIsErrorDialogOpen: (value: React.SetStateAction<boolean>) => void;
}

const FormView = (props: FormViewProps) => {
  const login = useGlobalStore((state) => state.login);
  const navigation = useNavigation();

  const validateForm = (form: LoginSchema): boolean => {
    const isValid = loginSchema.safeParse(form);

    if (!isValid.success) {
      const fieldErrors = isValid.error.formErrors.fieldErrors;
      props.setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
    } else {
      props.setErrors({});
    }

    return isValid.success;
  };

  const validateField = (field: keyof LoginSchema, value: string): void => {
    const result = loginSchema.shape[field].safeParse(value);

    if (!result.success) {
      props.setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: result.error.errors[0].message,
      }));
      if (field === "password") {
        props.setForm((prevForm) => ({ ...prevForm, password: "" }));
      }
    } else {
      props.setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: undefined,
      }));
    }
  };

  const handleLogin = async () => {
    const isValid = validateForm(props.form);
    if (!isValid) return;

    props.setIsLoading(true);
    const response = await login(props.form);
    props.setIsLoading(false);

    if (!response.isSuccess) {
      props.setErrors(response.error);
      props.setIsErrorDialogOpen(true);
      return;
    }
    navigation.goBack();
    console.log("Logged in!");
  };

  return (
    <View className="gap-2">
      <FormField
        value={props.form.email}
        errorMessage={props.errors?.email}
        onChangeText={(text) => {
          const updatedForm = { ...props.form, email: text };
          props.setForm(updatedForm);
          validateField("email", text);
        }}
        nativeID="email"
        title="Địa chỉ email"
        placeholder="Email của bạn"
        keyboardType="email-address"
        required
      />

      <FormField
        value={props.form.password}
        errorMessage={props.errors?.password}
        onChangeText={(text) => {
          const updatedForm = { ...props.form, password: text };
          props.setForm(updatedForm);
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

const LinksView = () => {
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
