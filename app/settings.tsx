import { Link } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { Info } from "~/lib/icons/Info";
import { MoonStar } from "~/lib/icons/MoonStar";

const SettingsScreen = () => {
  const scrollRef = React.useRef<ScrollView>(null);

  return (
    <SafeAreaView className="h-full bg-secondary/30">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4"
      >
        <SettingsContainer />
      </ScrollView>
    </SafeAreaView>
  );
};

const SettingsContainer = () => {
  return (
    <View className="gap-4">
      <Button
        variant={"outline"}
        className="shadow-sm shadow-foreground/5 !bg-background"
      >
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center gap-4">
            <MoonStar className="text-primary" size={16} strokeWidth={2} />
            <Text className="font-bold">Chế độ tối</Text>
          </View>
          <ThemeToggle className="mr-0" swtich />
        </View>
      </Button>
      <Button
        variant={"outline"}
        className="shadow-sm shadow-foreground/5 !bg-background"
      >
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center gap-4">
            <Info className="text-primary" size={16} strokeWidth={2} />
            <Text className="font-bold">Giới thiệu</Text>
          </View>
          <ChevronRight className="text-primary" size={24} strokeWidth={2} />
        </View>
      </Button>
      <Link href={"/tflite"} asChild>
        <Button
          variant={"outline"}
          className="items-start shadow-sm shadow-foreground/5"
        >
          <View className="flex-row items-center justify-between w-full">
            <View className="flex-row items-center gap-4">
              {/* <User className="text-primary" size={16} strokeWidth={2} /> */}
              <Text className="font-bold">TFLite</Text>
            </View>
            <ChevronRight className="text-primary" size={24} strokeWidth={2} />
          </View>
        </Button>
      </Link>
    </View>
  );
};

export default SettingsScreen;
