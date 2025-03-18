import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { Image, ScrollView, View } from "react-native";
import WebView from "react-native-webview";
import { getPlantById } from "~/api/plants";
import { Text } from "~/components/ui/text";
import WebViewStyled from "~/components/WebViewStyled";
import { useStore } from "~/stores/index";

const PlantDetail = () => {
  const scrollRef = React.useRef<ScrollView>(null);
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [plant, setPlant] = React.useState<Plant>();

  React.useEffect(() => {
    const fetchPlant = async () => {
      if (typeof id !== "string" || id === "[id]") return;

      useStore.setState({ isAppLoading: true });
      const plant = await getPlantById(id);
      useStore.setState({ isAppLoading: false });

      if (!plant) {
        navigation.goBack();
        return;
      }
      setPlant(plant);
    };

    fetchPlant();
  }, []);

  return (
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      contentContainerClassName="p-4"
    >
      {plant && <PlantInfo plant={plant} />}
    </ScrollView>
  );
};

const PlantInfo = ({ plant }: { plant: Plant }) => {
  const care_instructions = `
    <div style="font-size: 42px; line-height: 1.5">
      ${plant.care_instructions}
    </div>
  `;

  return (
    <View className="gap-4">
      <View className="max-h-[300px]">
        <Image
          source={{ uri: plant.image }}
          className="w-full h-full rounded-md"
        />
      </View>
      <Text className="text-2xl font-bold">{plant.name}</Text>
      <View className="justify-between flex-1 gap-1">
        <View>
          <Text className="font-bold">Tên khoa học</Text>
          <Text>{plant.scientific_name}</Text>
        </View>
        <View>
          <Text className="text-sm font-bold">Họ</Text>
          <Text>{plant.family}</Text>
        </View>
        <View>
          <Text className="font-bold">Mô tả</Text>
          <Text>{plant.description}</Text>
        </View>
        <View>
          <Text className="font-bold">Cách chăm sóc</Text>
          <WebViewStyled
            className="min-h-[1000px]"
            source={{ html: care_instructions }}
          />
        </View>
      </View>
    </View>
  );
};

export default PlantDetail;
