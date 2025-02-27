import { useNavigation } from "expo-router";
import { AuthErrors, GoogleSigninErrors, loginWithGoogle } from "~/api/auth";
import GoogleSvg from "~/assets/icons/icons8-google.svg";
import { useErrorPopup } from "~/components/ErrorPopupBoundary";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AppErrors } from "~/lib/errors";
import { useGlobalStore } from "~/lib/global-store";
import { catchErrorTyped } from "~/lib/utils";

const GoogleLoginButton = (props: { children?: string }) => {
  const navigation = useNavigation();
  const { showErrorPopup } = useErrorPopup();

  const handleGoogleLogin = async () => {
    useGlobalStore.setState({ isAppLoading: true });

    const [error] = await catchErrorTyped(loginWithGoogle(), [
      AuthErrors,
      GoogleSigninErrors,
      AppErrors,
    ]);
    if (error === undefined) {
      navigation.goBack();
    } else if (error instanceof GoogleSigninErrors) {
    } else if (
      error instanceof AppErrors &&
      error.code == AppErrors.NetworkError.code
    ) {
      showErrorPopup({ message: error.message });
    } else {
      showErrorPopup();
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
