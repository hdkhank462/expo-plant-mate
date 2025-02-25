import GoogleSvg from "~/assets/icons/icons8-google.svg";
import { Button, ButtonProps } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const GoogleLoginButton = (props: ButtonProps) => {
  return (
    <Button
      variant={"outline"}
      onPress={props.onPress}
      className="flex-row gap-2 shadow-sm shadow-foreground/5"
    >
      <GoogleSvg />
      <Text>Đăng nhập bằng Google</Text>
    </Button>
  );
};

export default GoogleLoginButton;
