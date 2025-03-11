import { Link } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Eye } from "~/lib/icons/Eye";
import { Plus } from "~/lib/icons/Plus";
import { Trash } from "~/lib/icons/Trash";

const PlantCard = ({
  plant,
  canSave,
  userPlantId,
  handleOnSave,
  handleOnDelete,
}: {
  plant: Plant;
  canSave?: boolean;
  userPlantId?: number;
  handleOnSave?: (plantId: number) => Promise<void>;
  handleOnDelete: (userPlantId: number) => Promise<void>;
}) => {
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
            </View>
          </View>
        </View>
      </CardContent>
      <CardFooter className="px-2 pb-2">
        <View className="flex-row items-center justify-end flex-1 gap-2">
          <Link href={`/plants/${plant.id}`} asChild>
            <Button
              variant={"outline"}
              size={"sm"}
              className="flex-row items-center gap-2"
            >
              <Eye className="text-primary" size={20} />
              <Text className="font-bold text-primary">Chi tiết</Text>
            </Button>
          </Link>
          {canSave && userPlantId ? (
            <Button
              onPress={() => handleOnDelete(userPlantId)}
              size={"sm"}
              variant={"destructive"}
              className="flex-row items-center gap-1"
            >
              <Trash className="text-primary-foreground" size={20} />
              <Text className="font-bold text-primary-foreground">Bỏ lưu</Text>
            </Button>
          ) : (
            <Button
              onPress={() => {
                if (handleOnSave) handleOnSave(plant.id);
              }}
              size={"sm"}
              className="flex-row items-center gap-1"
            >
              <Plus className="text-primary-foreground" size={20} />
              <Text className="font-bold text-primary-foreground">Lưu</Text>
            </Button>
          )}
        </View>
      </CardFooter>
    </Card>
  );
};

export default PlantCard;
