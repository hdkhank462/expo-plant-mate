import LottieView from "lottie-react-native";
import { View } from "react-native";

export default function SplashScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <LottieView
        source={require("~/assets/lottiefiles/splash.json")}
        style={{ width: "100%", height: "100%" }}
        autoPlay
      />
    </View>
  );
}
