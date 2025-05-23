import { Link, useRouter } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import { unSavePlant, getUserPlants } from "~/api/plants";
import PlantCard from "~/components/PlantCard";
import Refresher from "~/components/Refresher";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import UnauthenticatedView from "~/components/UnauthenticatedView";
import { useStore } from "~/stores/index";
import { catchErrorTyped } from "~/lib/utils";

const PlantListScreen = () => {
  const scrollRef = React.useRef<ScrollView>(null);
  const userInfo = useStore((state) => state.userInfo);
  const [refreshing, setRefreshing] = React.useState(false);
  const [userPlants, setUserPlants] = React.useState<UserPlantsDetail[]>();

  React.useEffect(() => {
    refetch();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  }, []);

  const refetch = async () => {
    useStore.setState({ isAppLoading: true });

    if (userInfo) {
      const [errors, response] = await catchErrorTyped(getUserPlants(), []);
      if (response) {
        setUserPlants(response);
      }
    }

    useStore.setState({ isAppLoading: false });
  };

  const handleOnUnsave = async (userPlantId: number) => {
    useStore.setState({ isAppLoading: true });

    const [errors, isSuccess] = await catchErrorTyped(
      unSavePlant(userPlantId),
      []
    );

    if (isSuccess) {
      setUserPlants((prev) => prev?.filter((up) => up.id !== userPlantId));
      Toast.show({
        type: "success",
        text1: "Thông báo",
        text2: "Đã xóa cây khỏi bộ sưu tập",
      });
    }

    useStore.setState({ isAppLoading: false });
  };

  if (!userPlants) return null;

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
          {userPlants.length > 0 ? (
            <View className="gap-4">
              {userPlants.map((up) => (
                <PlantCard
                  key={up.plant_detail.id}
                  plant={up.plant_detail}
                  canSave={!!userInfo}
                  userPlantId={up.id}
                  onUnsave={handleOnUnsave}
                />
              ))}
            </View>
          ) : (
            <UserPlantsEmpty />
          )}
        </ScrollView>
      ) : (
        <UnauthenticatedView />
      )}
    </SafeAreaView>
  );
};

const UserPlantsEmpty = () => {
  return (
    <View className="items-center justify-center h-full gap-6">
      <View className="items-center justify-center w-full">
        <Text className="text-muted-foreground">Danh sách cây trống</Text>
        <Text className="text-muted-foreground">
          Tìm kiếm và chọn cây để thêm vào bộ sưu tập
        </Text>
      </View>

      <View className="flex-row gap-2">
        <Link href={"/search/[query]"} asChild>
          <Button
            variant={"outline"}
            size={"sm"}
            className="shadow-sm shadow-foreground/5"
          >
            <Text className="font-bold">Tìm kiếm</Text>
          </Button>
        </Link>
        {/* <Link href={"/(auth)/login"} asChild>
          <Button size={"sm"} className="shadow-sm shadow-foreground/5">
            <Text className="font-bold">Thêm mới</Text>
          </Button>
        </Link> */}
      </View>
    </View>
  );
};

export default PlantListScreen;
