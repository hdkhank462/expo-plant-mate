import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation, useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, View } from "react-native";
import { createPlantCare, getUserPlants } from "~/api/plants";
import PlantCareForm from "~/components/PlantCareForm";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { CARE_TYPES } from "~/constants/values";
import { useStore } from "~/stores/index";
import { catchErrorTyped } from "~/lib/utils";
import { plantCareSchema, PlantCareSchema } from "~/schemas/plant.schema";

const CreatePlantCareScreen = () => {
  const router = useRouter();
  const scrollRef = React.useRef<ScrollView>(null);

  const defaultTime = new Date();
  defaultTime.setHours(0, 0, 0, 0);
  const form = useForm<PlantCareSchema>({
    resolver: zodResolver(plantCareSchema),
    defaultValues: {
      type: CARE_TYPES[0],
      time: defaultTime,
      repeat: [],
    },
  });

  const onSubmit = async (values: PlantCareSchema) => {
    console.log("Submit values:", JSON.stringify(values, null, 2));
    const schema = plantCareSchema.parse(values);

    useStore.setState({ isAppLoading: true });

    const [errors, response] = await catchErrorTyped(
      createPlantCare(schema),
      []
    );

    useStore.setState({ isAppLoading: false });

    if (response) {
      router.replace("/(tabs)/plant-care");
    }
  };

  return (
    <SafeAreaView className="h-full p-4 bg-secondary/30">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="min-h-full"
      >
        <View className="gap-4">
          <PlantCareForm form={form} />
          <Button
            onPress={form.handleSubmit(onSubmit)}
            className="shadow-sm shadow-foreground/5"
          >
            <Text className="font-bold">Tạo</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePlantCareScreen;
