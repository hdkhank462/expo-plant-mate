import React from "react";
import { Button, ButtonProps } from "~/components/ui/button";
import { Camera } from "~/lib/icons/Camera";
import * as ImagePicker from "expo-image-picker";

const PickImageButton = ({
  handleOnPress,
  ...props
}: ButtonProps & {
  handleOnPress?: (image: ImagePicker.ImagePickerAsset) => void;
}) => {
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        return result.assets[0];
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onPress = async () => {
    const imagePicked = await pickImage();
    console.log("Picked image:", JSON.stringify(imagePicked, null, 2));
    if (handleOnPress && imagePicked) handleOnPress(imagePicked);
  };

  return (
    <Button {...props} onPress={onPress}>
      <Camera className="text-muted-foreground" size={20} />
    </Button>
  );
};

export default PickImageButton;
