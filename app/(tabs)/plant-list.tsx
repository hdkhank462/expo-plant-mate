import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

const PlantListScreen = () => {
  return (
    <View className="items-center justify-center flex-1 p-4 bg-secondary/30">
      <View className="w-full h-full">
        <Text className="text-lg font-bold">PlantListScreen</Text>
      </View>
    </View>
  );
};

export default PlantListScreen;
