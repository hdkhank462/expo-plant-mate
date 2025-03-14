import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePickerAsset } from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, View } from "react-native";
import Toast from "react-native-toast-message";
import {
  savePlant,
  unSavePlant,
  getUserPlants,
  PlantErrors,
  searchPlantByImage,
  searchPlantByKeyword,
} from "~/api/plants";
import PickImageButton from "~/components/PickImageButton";
import PlantCard from "~/components/PlantCard";
import Refresher from "~/components/Refresher";
import { Button } from "~/components/ui/button";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { useGlobalStore } from "~/lib/global-store";
import { Search } from "~/lib/icons/Search";
import { catchErrorTyped } from "~/lib/utils";
import { searchPlantSchema, SearchPlantSchema } from "~/schemas/plant.schema";

const SearchScreen = () => {
  const router = useRouter();
  const { query } = useLocalSearchParams();
  const isValidQuery = typeof query === "string" && query !== "[query]";
  const scrollRef = React.useRef<ScrollView>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchResult, setSearchResult] = React.useState<Plant[]>([]);
  const [userPlants, setUserPlants] = React.useState<UserPlantsDetail[]>([]);
  const userInfo = useGlobalStore((state) => state.userInfo);

  useEffect(() => {
    refetch(query);
  }, [query]);

  const onSearchByImage = async (image: ImagePickerAsset) => {
    const formData = new FormData();
    formData.append("image", {
      uri: image.uri,
      name: image.fileName,
      type: image.mimeType,
    } as any);

    useGlobalStore.setState({ isAppLoading: true });

    const [errors, response] = await catchErrorTyped(
      searchPlantByImage(formData),
      []
    );

    if (response) {
      setSearchResult(response.results);
    }
    useGlobalStore.setState({ isAppLoading: false });
  };

  const onSearchByKeyword = (values: SearchPlantSchema) => {
    console.log("Search", values);

    const schema = searchPlantSchema.parse(values);
    router.setParams({ query: schema.search });
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    refetch(query);
    setRefreshing(false);
  }, []);

  const refetch = async (query: string | string[]) => {
    if (typeof query !== "string" || query === "[query]") return;
    console.log("Refetching", query);

    useGlobalStore.setState({ isAppLoading: true });

    const [errors, response] = await catchErrorTyped(
      searchPlantByKeyword({ search: query }),
      []
    );
    if (errors) {
      console.error(errors);
      return;
    } else if (response) {
      setSearchResult(response.results);
    }

    if (userInfo) {
      const [errors2, response2] = await catchErrorTyped(getUserPlants(), []);
      if (errors2) {
        console.error(errors2);
        return;
      } else if (response2) {
        setUserPlants(response2);
      }
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  const handleOnSave = async (plantId: number) => {
    if (!userInfo) return;

    useGlobalStore.setState({ isAppLoading: true });

    const [errors, response] = await catchErrorTyped(
      savePlant(userInfo.pk, plantId),
      [PlantErrors]
    );

    if (errors) {
      Toast.show({
        type: "error",
        text1: "Thông báo",
        text2: errors.message,
      });
    } else if (response) {
      setUserPlants((prev) => [...prev, response]);
      Toast.show({
        type: "success",
        text1: "Thông báo",
        text2: "Đã lưu cây vào bộ sưu tập",
      });
    }
    useGlobalStore.setState({ isAppLoading: false });
  };

  const handleOnUnsave = async (userPlantId: number) => {
    useGlobalStore.setState({ isAppLoading: true });

    const [errors, isSuccess] = await catchErrorTyped(
      unSavePlant(userPlantId),
      []
    );

    if (isSuccess) {
      setUserPlants((prev) => prev.filter((up) => up.id !== userPlantId));
      Toast.show({
        type: "success",
        text1: "Thông báo",
        text2: "Đã xóa cây khỏi bộ sưu tập",
      });
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  return (
    <SafeAreaView className="h-full bg-secondary/30 pt-7">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4"
        refreshControl={
          <Refresher
            refreshing={refreshing}
            onRefresh={onRefresh}
            className="bg-secondary text-primary"
          />
        }
      >
        <View className="gap-4">
          <SearchForm
            onSearchByKeyword={onSearchByKeyword}
            onSearchByImage={onSearchByImage}
          />
          {isValidQuery && (
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-muted-foreground">
                Kết quả cho:
              </Text>
              <Text className="text-sm font-bold">{query}</Text>
            </View>
          )}

          <View className="gap-4">
            {searchResult.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                canSave={!!userInfo}
                userPlantId={userPlants.find((up) => up.plant === plant.id)?.id}
                onSave={handleOnSave}
                onUnsave={handleOnUnsave}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const SearchForm = ({
  onSearchByKeyword,
  onSearchByImage,
}: {
  onSearchByKeyword: (schema: SearchPlantSchema) => void;
  onSearchByImage?: (image: ImagePickerAsset) => void;
}) => {
  const form = useForm<SearchPlantSchema>({
    resolver: zodResolver(searchPlantSchema),
    defaultValues: {
      search: "",
    },
  });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="search"
        render={({ field }) => (
          <FormInput
            placeholder="Tìm kiếm cây"
            required
            {...field}
            iconEnd={
              <View className="absolute flex-row top-1 right-1">
                <PickImageButton
                  variant={"ghost"}
                  size={"icon"}
                  handleOnPress={onSearchByImage}
                />
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  onPress={form.handleSubmit(onSearchByKeyword)}
                >
                  <Search className="text-muted-foreground" size={20} />
                </Button>
              </View>
            }
          />
        )}
      />
    </Form>
  );
};

export default SearchScreen;
