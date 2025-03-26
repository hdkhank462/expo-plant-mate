import React from "react";
import { Button, ButtonProps } from "~/components/ui/button";
import { Camera } from "~/lib/icons/Camera";
import * as ImagePicker from "expo-image-picker";
import { usePopup } from "~/components/PopupProvider";

const PickImageButton = ({
  handleOnPress,
  ...props
}: ButtonProps & {
  handleOnPress?: (image: ImagePicker.ImagePickerAsset) => void;
}) => {
  const popup = usePopup();

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });
      if (!result.canceled) {
        return result.assets[0];
      }
    } catch (error) {
      console.error(error);
    }
  };

  const takePicture = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
        cameraType: ImagePicker.CameraType.back,
      });
      if (!result.canceled) {
        return result.assets[0];
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onPress = async () => {
    popup.confirm({
      title: "Chọn ảnh",
      description: "Chọn ảnh từ thư viện hoặc chụp ảnh mới",
      confirmButtonText: "Chụp ảnh",
      onConfirm: async () => {
        const imagePicked = await takePicture();
        if (handleOnPress && imagePicked) handleOnPress(imagePicked);
      },
      cancellButtonText: "Chọn ảnh",
      onCancell: async () => {
        const imagePicked = await pickImage();
        if (handleOnPress && imagePicked) handleOnPress(imagePicked);
      },
    });
  };

  return (
    <Button {...props} onPress={onPress}>
      <Camera className="text-muted-foreground" size={20} />
    </Button>
  );
};

export default PickImageButton;
