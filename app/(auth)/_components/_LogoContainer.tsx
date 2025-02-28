import { View } from "react-native";
import React from "react";
import { Image } from "react-native";

const LogoContainer = () => {
  return (
    <View className="items-center mt-4 mb-1">
      <Image
        className="h-32 rounded-full bg-secondary aspect-square"
        source={require("~/assets/images/logo/adaptive-icon/foreground.png")}
        resizeMode="cover"
      />
    </View>
  );
};
export default LogoContainer;
