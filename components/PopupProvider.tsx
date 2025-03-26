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

const PopupContext = React.createContext<
  | {
      show: (configs?: PopupConfigs) => void;
      error: (configs?: PopupErrorConfigs) => void;
      confirm: (configs?: PopupConfirmConfigs) => void;
    }
  | undefined
>(undefined);

const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error("usePopup must be used within an ErrorPopupProvider");
  }
  return context;
};

type PopupTypes = "default" | "error" | "confirm";

type PopupConfigs = {
  title?: string;
  description?: string;
};

interface PopupConfirmConfigs extends PopupConfigs {
  confirmButtonText?: string;
  cancellButtonText?: string;
  onConfirm?: () => void;
  onCancell?: () => void;
}

interface PopupErrorConfigs extends PopupConfigs {
  onClose?: () => void;
}

const PopupProvider = (props: React.PropsWithChildren) => {
  const [popupConfigs, setPopupCongifs] = React.useState<any>();
  const [isPopupOpen, setPopupOpen] = React.useState(false);
  const [popupType, setPopupType] = React.useState<PopupTypes>("default");

  const showDefaultPopup = (configs?: PopupConfigs) => {
    setPopupType("default");
    setPopupCongifs(configs);
    setPopupOpen(true);
  };

  const showErrorPopup = (configs?: PopupErrorConfigs) => {
    setPopupType("error");
    setPopupCongifs(configs);
    setPopupOpen(true);
  };

  const showConfirmPopup = (configs?: PopupConfirmConfigs) => {
    setPopupType("confirm");
    setPopupCongifs(configs);
    setPopupOpen(true);
  };

  return (
    <PopupContext.Provider
      value={{
        show: showDefaultPopup,
        error: showErrorPopup,
        confirm: showConfirmPopup,
      }}
    >
      <Dialog open={isPopupOpen} onOpenChange={setPopupOpen}>
        <View className="h-full">{props.children}</View>

        {popupType === "confirm" ? (
          <ConfirmPopupContent configs={popupConfigs} />
        ) : (
          <ErrorPopupContent configs={popupConfigs} />
        )}
      </Dialog>
    </PopupContext.Provider>
  );
};

const ErrorPopupContent = ({ configs }: { configs: PopupConfirmConfigs }) => {
  return (
    <DialogContent className="min-w-[16rem] max-w-full p-4">
      <DialogHeader>
        <DialogTitle>{configs?.title ?? "Thông báo"}</DialogTitle>
        <DialogDescription>
          <Text className="text-sm text-muted-foreground">
            {configs?.description ?? AppErrors.UnknownError.message}
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
  );
};

const ConfirmPopupContent = ({ configs }: { configs: PopupConfirmConfigs }) => {
  return (
    <DialogContent className="min-w-[16rem] max-w-full p-4">
      <DialogHeader>
        <DialogTitle>{configs?.title ?? "Thông báo"}</DialogTitle>
        <DialogDescription>
          <Text className="text-sm text-muted-foreground">
            {configs.description}
          </Text>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <View className="flex-row items-center justify-end gap-2">
          {configs.onCancell && (
            <DialogClose asChild>
              <Button
                variant={"outline"}
                size={"sm"}
                onPress={configs.onCancell}
              >
                <Text>
                  {configs.cancellButtonText
                    ? configs.cancellButtonText
                    : "Huỷ"}
                </Text>
              </Button>
            </DialogClose>
          )}
          <DialogClose asChild>
            <Button size={"sm"} onPress={configs.onConfirm}>
              <Text>
                {configs.confirmButtonText
                  ? configs.confirmButtonText
                  : "Đồng ý"}
              </Text>
            </Button>
          </DialogClose>
        </View>
      </DialogFooter>
    </DialogContent>
  );
};

export { PopupProvider, usePopup };
