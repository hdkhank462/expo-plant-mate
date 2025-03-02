import { Link } from "expo-router";
import React from "react";
import { SafeAreaView, View } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

const HomeScreen = () => {
  return (
    <SafeAreaView className="h-full bg-secondary/30">
      <View className="p-4">
        <Text className="text-lg font-bold">Home</Text>
        <ThemeToggle />
        <Link href={"/test"} asChild>
          <Button
            variant={"outline"}
            className="items-start shadow-sm shadow-foreground/5"
          >
            <View className="flex-row items-center gap-4">
              <Text className="font-bold">Test</Text>
            </View>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
