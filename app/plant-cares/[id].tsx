import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, View } from "react-native";
import { getPlantCareById, updatePlantCare } from "~/api/plants";
import PlantCareForm from "~/components/PlantCareForm";
import { Button } from "~/components/ui/button";
import { CARE_TYPES } from "~/lib/constants";
import { useGlobalStore } from "~/lib/global-store";
import { catchErrorTyped } from "~/lib/utils";
import { Text } from "~/components/ui/text";
import { plantCareSchema, PlantCareSchema } from "~/schemas/plant.schema";

const UpdatePlantCareScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  const scrollRef = React.useRef<ScrollView>(null);
  const [plantCare, setPlantCare] = React.useState<UserPlantCare>();

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

  React.useLayoutEffect(() => {
    const getPlantCare = async () => {
      if (typeof id !== "string" || id === "[id]") return;

      useGlobalStore.setState({ isAppLoading: true });

      const [errors, response] = await catchErrorTyped(
        getPlantCareById(id),
        []
      );

      if (response) {
        setPlantCare(response);

        const tempDate = new Date();
        tempDate.setHours(parseInt(response.time.split(":")[0]));
        tempDate.setMinutes(parseInt(response.time.split(":")[1]));

        form.reset({
          userPlantId: {
            value: response.user_plant.toString(),
            label: response.user_plant_detail.plant_detail.name,
          },
          type: {
            value: response.type,
            label: CARE_TYPES.find((ct) => ct.value === response.type)?.label,
          },
          time: tempDate,
          repeat: response.repeat,
        });
      }

      useGlobalStore.setState({ isAppLoading: false });
    };

    getPlantCare();
  }, []);

  const onSubmit = async (values: PlantCareSchema) => {
    if (typeof id !== "string" || id === "[id]") return;

    console.log("Submit values:", JSON.stringify(values, null, 2));
    const schema = plantCareSchema.parse(values);

    useGlobalStore.setState({ isAppLoading: true });

    const [errors, response] = await catchErrorTyped(
      updatePlantCare(id, schema),
      []
    );

    useGlobalStore.setState({ isAppLoading: false });

    if (response) {
      router.replace("/(tabs)/plant-care");
    }
  };

  if (!plantCare) return null;

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
            <Text className="font-bold">Lưu</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdatePlantCareScreen;
