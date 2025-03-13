import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { use } from "i18next";
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { SafeAreaView, ScrollView, View } from "react-native";
import { createPlantCare, getUserPlants } from "~/api/plants";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormCheckboxGroup,
  FormDatePicker,
  FormField,
  FormSelect,
} from "~/components/ui/form";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { ToggleGroupItem } from "~/components/ui/toggle-group";
import { CARE_TYPES, WEEKDAYS } from "~/lib/constants";
import { useGlobalStore } from "~/lib/global-store";
import { catchErrorTyped } from "~/lib/utils";
import { plantCareSchema, PlantCareSchema } from "~/schemas/plant.schema";

const CreatePlantCareScreen = () => {
  const scrollRef = React.useRef<ScrollView>(null);
  const userInfo = useGlobalStore((state) => state.userInfo);
  const [userPlants, setUserPlants] = React.useState<TSelectValue[]>([]);

  const defaultTime = new Date();
  defaultTime.setHours(0, 0, 0, 0);
  const form = useForm<PlantCareSchema>({
    resolver: zodResolver(plantCareSchema),
    defaultValues: {
      type: CARE_TYPES[0],
      time: new Date(),
      repeat: [],
    },
  });

  React.useEffect(() => {
    getUserPlantCare();
  }, []);

  const getUserPlantCare = async () => {
    if (!userInfo) return;
    useGlobalStore.setState({ isAppLoading: true });

    const [errors, response] = await catchErrorTyped(getUserPlants(), []);
    if (response) {
      const temp = response.map((up) => ({
        value: up.id.toString(),
        label: up.plant_detail.name,
      }));
      setUserPlants(temp);
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  const onSubmit = async (values: PlantCareSchema) => {
    console.log("Submit values:", JSON.stringify(values, null, 2));
    const schema = plantCareSchema.parse(values);

    useGlobalStore.setState({ isAppLoading: true });

    const [errors, response] = await catchErrorTyped(
      createPlantCare(schema),
      []
    );

    if (response) {
      router.replace("/(tabs)/plant-care");
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  return (
    <SafeAreaView className="h-full p-4 bg-secondary/30">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="min-h-full"
      >
        <View className="gap-4">
          <PlantCareForm form={form} userPlants={userPlants} />
          <Button onPress={form.handleSubmit(onSubmit)}>
            <Text className="font-bold">Thêm</Text>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const PlantCareForm = ({
  form,
  userPlants,
}: {
  form: UseFormReturn<PlantCareSchema, any, undefined>;
  userPlants: TSelectValue[];
}) => {
  const [selectTriggerWidth, setSelectTriggerWidth] = React.useState(0);

  return (
    <Form {...form}>
      <View className="gap-4">
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormDatePicker {...field} date={new Date()} mode="time" />
          )}
        />
        <FormField
          control={form.control}
          name="userPlantId"
          render={({ field }) => (
            <FormSelect {...field} label="Cây cần chăm sóc">
              <SelectTrigger
                onLayout={(ev) => {
                  setSelectTriggerWidth(ev.nativeEvent.layout.width);
                }}
              >
                <SelectValue
                  className="text-sm text-foreground native:text-lg"
                  placeholder="Chọn cây cần chăm sóc"
                />
              </SelectTrigger>
              <SelectContent style={{ width: selectTriggerWidth }}>
                <SelectGroup>
                  {userPlants.map((up) => (
                    <SelectItem
                      key={up.value}
                      value={up.value}
                      label={up.label}
                    >
                      {up.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </FormSelect>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormSelect {...field} label="Loại chăm sóc">
              <SelectTrigger
                onLayout={(ev) => {
                  setSelectTriggerWidth(ev.nativeEvent.layout.width);
                }}
              >
                <SelectValue
                  className="text-sm text-foreground native:text-lg"
                  placeholder="Chọn loại chăm sóc"
                />
              </SelectTrigger>
              <SelectContent style={{ width: selectTriggerWidth }}>
                <SelectGroup>
                  {CARE_TYPES.map((type) => (
                    <SelectItem
                      key={type.value}
                      value={type.value}
                      label={type.label}
                    >
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </FormSelect>
          )}
        />

        <FormField
          control={form.control}
          name="repeat"
          render={({ field }) => (
            <FormCheckboxGroup
              {...field}
              type="multiple"
              label="Lặp lại"
              className="justify-between"
            >
              {WEEKDAYS.map((day) => (
                <ToggleGroupItem
                  key={day.value}
                  value={day.value}
                  size={"sm"}
                  className="rounded-full"
                >
                  <Text>{day.label}</Text>
                </ToggleGroupItem>
              ))}
            </FormCheckboxGroup>
          )}
        />
      </View>
    </Form>
  );
};

export default CreatePlantCareScreen;
