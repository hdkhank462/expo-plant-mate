import LottieView from "lottie-react-native";
import React from "react";
import { View } from "react-native";

const LoadingOverlay = () => {
  return (
    <View className="absolute inset-0 items-center justify-center bg-black/30">
      <LottieView
        source={require("~/assets/lottiefiles/circle-loading.json")}
        style={{ width: "50%", height: "50%" }}
        autoPlay
        loop
      />
    </View>
  );
};

export default LoadingOverlay;
