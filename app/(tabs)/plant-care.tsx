import { Link, useNavigation, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { getPlantCares } from "~/api/plants";
import Refresher from "~/components/Refresher";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Text } from "~/components/ui/text";
import UnauthenticatedView from "~/components/UnauthenticatedView";
import { CARE_TYPES, WEEKDAYS } from "~/lib/constants";
import { useGlobalStore } from "~/lib/global-store";
import { Plus } from "~/lib/icons/Plus";
import { Leaf } from "~/lib/icons/Leaf";
import { Repeat2 } from "~/lib/icons/Repeat2";
import { catchErrorTyped } from "~/lib/utils";

const PlantCareScreen = () => {
  const scrollRef = React.useRef<ScrollView>(null);
  const navigation = useNavigation();
  const userInfo = useGlobalStore((state) => state.userInfo);
  const [refreshing, setRefreshing] = React.useState(false);
  const [plantCares, setPlantCares] = React.useState<UserPlantCare[]>();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Link href={"/plant-cares/create"} asChild>
          <Button variant={"ghost"} size={"icon"} className="mr-3">
            <Plus className="text-foreground" size={24} strokeWidth={2} />
          </Button>
        </Link>
      ),
    });
  }, [navigation]);

  React.useLayoutEffect(() => {
    refetch();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  const refetch = async () => {
    if (!userInfo) return;

    useGlobalStore.setState({ isAppLoading: true });

    const [errors, response] = await catchErrorTyped(getPlantCares(), []);

    if (response) {
      setPlantCares(response);
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  if (!plantCares) return null;

  return (
    <SafeAreaView className="h-full p-4 bg-secondary/30">
      {userInfo ? (
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="min-h-full"
          refreshControl={
            <Refresher
              refreshing={refreshing}
              onRefresh={onRefresh}
              className="bg-secondary text-primary"
            />
          }
        >
          {plantCares.length > 0 ? (
            <View className="gap-4">
              {plantCares.map((plantCare) => (
                <PlantCareCard key={plantCare.id} plantCare={plantCare} />
              ))}
            </View>
          ) : (
            <PlantCareEmpty />
          )}
        </ScrollView>
      ) : (
        <UnauthenticatedView />
      )}
    </SafeAreaView>
  );
};

const PlantCareCard = ({ plantCare }: { plantCare: UserPlantCareLocal }) => {
  const router = useRouter();
  const [isEnabled, setIsEnabled] = React.useState(plantCare.enabled || false);

  const repeat =
    plantCare.repeat.length > 0
      ? plantCare.repeat.length == 7
        ? "Hàng ngày"
        : WEEKDAYS.filter((day) =>
            plantCare.repeat.includes(day.value as WeekDay)
          )
            .map((day) => day.label)
            .join(", ")
      : "Một lần";

  React.useEffect(() => {
    if (isEnabled) {
      // TODO: Schedule notification
    } else {
      // TODO: Cancel notification
    }
  }, [isEnabled]);

  return (
    <Card>
      <CardContent className="p-2">
        <View className="flex-row justify-between">
          <View className="relative flex-1">
            <Button
              variant={"ghost"}
              className="absolute top-0 left-0 w-full !h-full z-50 !bg-transparent"
              onPress={() => {
                router.push(`/plant-cares/${plantCare.id}`);
              }}
            />
            <Text className="text-4xl font-bold">{plantCare.time}</Text>
            <View className="flex-row items-center gap-1">
              <Repeat2
                className="text-card-foreground"
                size={16}
                strokeWidth={1.5}
              />
              <Text className="text-sm text-card-foreground">
                {repeat}
                {" • "}
                {
                  CARE_TYPES.filter((type) => type.value == plantCare.type)[0]
                    .label
                }
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Leaf
                className="text-card-foreground"
                size={16}
                strokeWidth={2.5}
              />
              <Text className="text-lg font-bold">
                {plantCare.user_plant_detail.plant_detail.name}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Switch
              checked={isEnabled}
              onCheckedChange={() => {
                setIsEnabled((prev) => !prev);
              }}
            />
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

const PlantCareEmpty = () => {
  return (
    <View className="items-center justify-center h-full gap-6">
      <View className="items-center justify-center w-full">
        <Text className="text-muted-foreground">Lịch chăm cây trống</Text>
        <Text className="text-muted-foreground">
          Thêm lịch chăm cây để nhận thông báo
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Link href={"/plant-cares/create"} asChild>
          <Button size={"sm"} className="shadow-sm shadow-foreground/5">
            <Text className="font-bold">Thêm</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
};

export default PlantCareScreen;
