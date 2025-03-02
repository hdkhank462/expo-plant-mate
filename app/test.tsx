import { SafeAreaView, ScrollView, View } from "react-native";
import React from "react";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { usePopup } from "~/components/PopupProvider";

const TestScren = () => {
  const scrollRef = React.useRef<ScrollView>(null);
  const popup = usePopup();

  return (
    <SafeAreaView>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4"
      >
        <Button
          onPress={() => {
            popup.error({
              description: "Test popup error",
            });
          }}
        >
          <Text>Test Popup Error</Text>
        </Button>
        <Button
          onPress={() => {
            popup.confirm({
              description: "Test popup confirm",
              onConfirm: () => {
                console.log("Confirmed!");
              },
            });
          }}
        >
          <Text>Test Popup Confirm </Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TestScren;
