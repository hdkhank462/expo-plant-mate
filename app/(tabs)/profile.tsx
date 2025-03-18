import { Link, useNavigation } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { getUserInfo } from "~/api/auth";
import CardWithTitle from "~/components/CardWithTitle";
import LogoutButton from "~/components/LogoutButton";
import Refresher from "~/components/Refresher";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import UnauthenticatedView from "~/components/UnauthenticatedView";
import { CalendarClock } from "~/lib/icons/CalendarClock";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { Settings } from "~/lib/icons/Settings";
import { User } from "~/lib/icons/User";
import { catchErrorTyped } from "~/lib/utils";
import { useStore } from "~/stores/index";

const ProfileScreen = () => {
  const navigation = useNavigation();
  const userInfo = useStore((state) => state.userInfo);
  const scrollRef = React.useRef<ScrollView>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Link href={"/settings"} asChild>
          <Button variant={"ghost"} size={"icon"} className="mr-3">
            <Settings className="text-foreground" size={24} strokeWidth={2} />
          </Button>
        </Link>
      ),
    });
  }, [navigation]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    await catchErrorTyped(getUserInfo(), []);

    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView className="h-full bg-secondary/30">
      {userInfo ? (
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerClassName="p-4"
          refreshControl={
            userInfo ? (
              <Refresher
                refreshing={refreshing}
                onRefresh={onRefresh}
                className="bg-secondary text-primary"
              />
            ) : undefined
          }
        >
          <ProfileView userInfo={userInfo} />
        </ScrollView>
      ) : (
        <UnauthenticatedView />
      )}
    </SafeAreaView>
  );
};

const ProfileView = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <View className="gap-4">
      <View className="items-center gap-2">
        <Avatar alt="Avatar" className="w-24 h-24">
          <AvatarImage
            source={{
              uri: userInfo.avatar_url,
            }}
          />
          <AvatarFallback>
            <Text className="text-lg">N/A</Text>
          </AvatarFallback>
        </Avatar>

        <View className="items-center">
          <Text className="text-lg font-bold">{userInfo.full_name}</Text>
          <Text className="text-sm text-muted-foreground">
            {userInfo.email}
          </Text>
        </View>
      </View>
      <DateJoinedCard userInfo={userInfo} />

      <Link href={"/account"} asChild>
        <Button
          variant={"outline"}
          className="items-start shadow-sm shadow-foreground/5"
        >
          <View className="flex-row items-center justify-between w-full">
            <View className="flex-row items-center gap-4">
              <User className="text-primary" size={16} strokeWidth={2} />
              <Text className="font-bold">Tài khoản</Text>
            </View>
            <ChevronRight className="text-primary" size={24} strokeWidth={2} />
          </View>
        </Button>
      </Link>

      <LogoutButton />
    </View>
  );
};

const DateJoinedCard = ({ userInfo }: { userInfo: UserInfo }) => {
  return (
    <CardWithTitle title="Ngày tham gia">
      <View className="flex-row items-center gap-2">
        <CalendarClock
          className="text-card-foreground"
          size={16}
          strokeWidth={2}
        />
        <Text className="text-lg">
          {new Date(userInfo.date_joined).toLocaleString("vi-VN", {
            timeStyle: "short",
            dateStyle: "medium",
          })}
        </Text>
      </View>
    </CardWithTitle>
  );
};

export default ProfileScreen;
