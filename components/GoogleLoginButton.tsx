import { useNavigation } from "expo-router";
import { loginWithGoogle } from "~/api/auth";
import GoogleSvg from "~/assets/icons/icons8-google.svg";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useGlobalStore } from "~/lib/global-store";
import { catchErrorTyped } from "~/lib/utils";

const GoogleLoginButton = (props: { children?: string }) => {
  const navigation = useNavigation();

  const handleGoogleLogin = async () => {
    useGlobalStore.setState({ isAppLoading: true });

    const [error, data] = await catchErrorTyped(loginWithGoogle(), []);

    if (!!data) {
      navigation.goBack();
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  return (
    <Button
      variant={"outline"}
      onPress={handleGoogleLogin}
      className="flex-row gap-2 shadow-sm shadow-foreground/5"
    >
      <GoogleSvg />
      <Text>{props.children ?? "Đăng nhập bằng Google"}</Text>
    </Button>
  );
};

export default GoogleLoginButton;
