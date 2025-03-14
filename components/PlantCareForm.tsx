import React from "react";
import { UseFormReturn } from "react-hook-form";
import { View } from "react-native";
import { getUserPlants } from "~/api/plants";
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
import { PlantCareSchema } from "~/schemas/plant.schema";

const PlantCareForm = ({
  form,
}: {
  form: UseFormReturn<PlantCareSchema, any, undefined>;
}) => {
  const userInfo = useGlobalStore((state) => state.userInfo);
  const [userPlants, setUserPlants] = React.useState<TSelectValue[]>([]);
  const [selectTriggerWidth, setSelectTriggerWidth] = React.useState(0);

  React.useLayoutEffect(() => {
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

    getUserPlantCare();
  }, []);

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

export default PlantCareForm;
