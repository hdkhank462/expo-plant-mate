import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePickerAsset } from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Image, SafeAreaView, ScrollView, View } from "react-native";
import { searchByImage, searchByKeyword } from "~/api/plants";
import PickImageButton from "~/components/PickImageButton";
import Refresher from "~/components/Refresher";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { useGlobalStore } from "~/lib/global-store";
import { Eye } from "~/lib/icons/Eye";
import { Plus } from "~/lib/icons/Plus";
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
      searchByImage(formData),
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
      searchByKeyword({ search: query }),
      []
    );
    if (errors) {
      console.error(errors);
      return;
    } else if (response) {
      setSearchResult(response.results);
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
              <PlantCard key={plant.identifier} plant={plant} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const PlantCard = ({ plant }: { plant: Plant }) => {
  return (
    <Card>
      <CardContent className="p-2">
        <View className="flex-row items-center gap-2">
          <View className="flex-auto rounded-md shadow-sm aspect-square">
            <Image
              source={{ uri: plant.image }}
              className="w-full h-full rounded-md"
            />
          </View>
          <View className="flex-auto h-full">
            <View className="justify-between flex-1 gap-1">
              <View>
                <Text className="text-xs font-bold ">Tên</Text>
                <Text className="text-xs text-muted-foreground">
                  {plant.name}
                </Text>
              </View>
              <View>
                <Text className="text-xs font-bold ">Tên khoa học</Text>
                <Text className="text-xs text-muted-foreground">
                  {plant.scientific_name}
                </Text>
              </View>
              <View>
                <Text className="text-xs font-bold ">Họ</Text>
                <Text className="text-xs text-muted-foreground">
                  {plant.family}
                </Text>
              </View>
              {/* <View>
                <Text className="text-xs font-bold ">Mô tả</Text>
                <Text className="text-xs border text-muted-foreground">
                  {plant.description.slice(0, 50)}...
                </Text>
              </View> */}
            </View>
          </View>
        </View>
      </CardContent>
      <CardFooter className="px-2 pb-2">
        <View className="flex-row items-center justify-end flex-1 gap-2">
          <Button
            variant={"outline"}
            size={"sm"}
            className="flex-row items-center gap-2"
          >
            <Eye className="text-primary" size={20} />
            <Text className="font-bold text-primary">Chi tiết</Text>
          </Button>
          <Button size={"sm"} className="flex-row items-center gap-1">
            <Plus className="text-primary-foreground" size={20} />
            <Text className="font-bold text-primary-foreground">Lưu</Text>
          </Button>
        </View>
      </CardFooter>
    </Card>
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
            placeholder="Tìm kiếm"
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
