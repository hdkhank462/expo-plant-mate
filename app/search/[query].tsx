import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { SafeAreaView, ScrollView, View } from "react-native";
import Refresher from "~/components/Refresher";
import { AspectRatio } from "~/components/ui/aspect-ratio";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { Search } from "~/lib/icons/Search";
import { searchPlantSchema, SearchPlantSchema } from "~/schemas/plant.schema";
import { Plus } from "~/lib/icons/Plus";
import { Eye } from "~/lib/icons/Eye";
import { zodResolver } from "@hookform/resolvers/zod";

const SearchScreen = () => {
  const router = useRouter();
  const { query } = useLocalSearchParams();
  const isValidQuery = typeof query === "string" && query !== "[query]";
  const scrollRef = React.useRef<ScrollView>(null);
  const [refreshing, setRefreshing] = React.useState(false);
  const form = useForm<SearchPlantSchema>({
    resolver: zodResolver(searchPlantSchema),
    defaultValues: {
      search: "",
    },
  });

  useEffect(() => {
    refetch(query);
  }, [query]);

  const onSubmit = (values: SearchPlantSchema) => {
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

    // TODO: Call API here
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
        <View className="gap-4 border">
          <View>
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
                      <Button
                        variant={"ghost"}
                        size={"icon"}
                        onPress={form.handleSubmit(onSubmit)}
                        className="absolute top-1 right-1"
                      >
                        <Search className="text-muted-foreground" size={20} />
                      </Button>
                    }
                  />
                )}
              />
            </Form>
          </View>
          {isValidQuery && (
            <View className="flex-row items-center gap-2">
              <Text className="text-sm text-muted-foreground">
                Kết quả cho:
              </Text>
              <Text className="text-sm font-bold">{query}</Text>
            </View>
          )}

          <View className="gap-4">
            <Card>
              <CardContent className="p-2">
                <View className="flex-row items-center gap-2">
                  <View className="flex-auto rounded-md shadow-sm">
                    <AspectRatio ratio={1} />
                  </View>
                  <View className="flex-auto h-full ">
                    <View className="justify-between flex-1 gap-1">
                      <View>
                        <Text className="text-xs font-bold ">Tên</Text>
                        <Text className="text-xs text-muted-foreground">
                          Tên khoa học
                        </Text>
                      </View>
                      <View>
                        <Text className="text-xs font-bold ">Họ</Text>
                        <Text className="text-xs text-muted-foreground">
                          Ha, as
                        </Text>
                      </View>
                      <View>
                        <Text className="text-xs font-bold ">Chi</Text>
                        <Text className="text-xs text-muted-foreground">
                          Ha, as
                        </Text>
                      </View>
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
                    <Text className="font-bold text-primary-foreground">
                      Lưu
                    </Text>
                  </Button>
                </View>
              </CardFooter>
            </Card>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
