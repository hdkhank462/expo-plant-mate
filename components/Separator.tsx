import { View } from "react-native";
import React from "react";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  label?: string;
};

const Separator = ({ label, orientation = "horizontal" }: SeparatorProps) => {
  if (label && orientation === "horizontal") {
    return (
      <View className="flex-row items-center gap-2">
        <View className="h-[2px] flex-1 bg-muted" />
        <Text className="text-muted-foreground">{label}</Text>
        <View className="h-[2px] flex-1 bg-muted" />
      </View>
    );
  }

  return (
    <View
      className={cn(
        "bg-muted",
        orientation === "horizontal" ? "h-[2px] w-full" : "w-[2px] h-full"
      )}
    />
  );
};

export default Separator;
