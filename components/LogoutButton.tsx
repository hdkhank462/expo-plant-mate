import React from "react";
import { View } from "react-native";
import { logout } from "~/api/auth";
import { useErrorPopup } from "~/components/ErrorPopupBoundary";
import { Button, ButtonProps } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { AppErrors } from "~/lib/errors";
import { useGlobalStore } from "~/lib/global-store";
import { LogOut } from "~/lib/icons/LogOut";
import { catchErrorTyped, cn } from "~/lib/utils";

const LogoutButton = ({ children, className }: ButtonProps) => {
  const { showErrorPopup } = useErrorPopup();

  const handleLogout = async () => {
    useGlobalStore.setState({ isAppLoading: true });

    const [error] = await catchErrorTyped(logout(), [AppErrors]);

    if (error && error.code === AppErrors.UnknownError.code) {
      showErrorPopup();
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  return (
    <Button
      variant={"outline"}
      onPress={handleLogout}
      className={cn("items-start shadow-sm shadow-foreground/5", className)}
    >
      {children ? (
        children
      ) : (
        <View className="flex-row items-center gap-4">
          <LogOut className="text-destructive" size={16} strokeWidth={2} />
          <Text className="font-bold text-destructive group-active:text-destructive">
            Đăng xuất
          </Text>
        </View>
      )}
    </Button>
  );
};

export default LogoutButton;
