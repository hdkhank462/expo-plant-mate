import LottieView from "lottie-react-native";
import { View } from "react-native";

export default function SplashScreen() {
  return (
    <View className="items-center justify-center flex-1 bg-white">
      <LottieView
        source={require("~/assets/lottiefiles/splash-animation.json")}
        style={{ width: "100%", height: "100%" }}
        speed={1.5}
        autoPlay={true}
        loop={false}
      />
    </View>
  );
}
