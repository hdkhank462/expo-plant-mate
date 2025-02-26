import React, { useContext } from "react";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Text } from "~/components/ui/text";
import { AppErrors } from "~/lib/errors";

type PopupConfigs = {
  title?: string;
};

// Create a context for the dialog state
const ErrorPopupContext = React.createContext<
  | { showErrorPopup: (error?: AppError, configs?: PopupConfigs) => void }
  | undefined
>(undefined);

// Custom hook to use the ErrorPopupContext
const useErrorPopup = () => {
  const context = useContext(ErrorPopupContext);
  if (!context) {
    throw new Error("useErrorPopup must be used within an ErrorPopupProvider");
  }
  return context;
};

const ErrorPopupProvider = (props: React.PropsWithChildren) => {
  const [errorPopup, setErrorPopup] = React.useState<AppError>();
  const [popupConfigs, setPopupCongifs] = React.useState<PopupConfigs>();
  const [isPopupOpen, setPopupOpen] = React.useState(false);

  const showErrorPopup = (error?: AppError, configs?: PopupConfigs) => {
    setErrorPopup(error);
    setPopupCongifs(configs);
    setPopupOpen(true);
  };

  return (
    <ErrorPopupContext.Provider value={{ showErrorPopup }}>
      <Dialog open={isPopupOpen} onOpenChange={setPopupOpen}>
        <View className="h-full">{props.children}</View>
        <DialogContent className="min-w-[16rem] max-w-full p-4">
          <DialogHeader>
            <DialogTitle>{popupConfigs?.title ?? "Thông báo"}</DialogTitle>
            <DialogDescription>
              <Text className="text-sm text-muted-foreground">
                {errorPopup?.message ?? AppErrors.UnknownError.message}
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
    </ErrorPopupContext.Provider>
  );
};

export { ErrorPopupProvider, useErrorPopup };
