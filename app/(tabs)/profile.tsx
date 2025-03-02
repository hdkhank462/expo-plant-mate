import { Link } from "expo-router";
import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { getUserInfo } from "~/api/auth";
import CardWithTitle from "~/components/CardWithTitle";
import ButtonWithIcon from "~/components/LogoutButton";
import Refresher from "~/components/Refresher";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import UnauthenticatedView from "~/components/UnauthenticatedView";
import { useGlobalStore } from "~/lib/global-store";
import { CalendarClock } from "~/lib/icons/CalendarClock";
import { MoonStar } from "~/lib/icons/MoonStar";
import { User } from "~/lib/icons/User";
import { catchErrorTyped } from "~/lib/utils";

const ProfileScreen = () => {
  const userInfo = useGlobalStore((state) => state.userInfo);
  const scrollRef = React.useRef<ScrollView>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    await catchErrorTyped(getUserInfo(), []);

    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView className="h-full bg-secondary/30">
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
        {userInfo ? (
          <ProfileView userInfo={userInfo} />
        ) : (
          <UnauthenticatedView />
        )}
      </ScrollView>
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
          <View className="flex-row items-center gap-4">
            <User className="text-primary" size={16} strokeWidth={2} />
            <Text className="font-bold">Tài khoản</Text>
          </View>
        </Button>
      </Link>

      <Button
        variant={"outline"}
        className="shadow-sm shadow-foreground/5 !bg-background"
      >
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center gap-4">
            <MoonStar className="text-primary" size={16} strokeWidth={2} />
            <Text className="font-bold">Chế độ tối</Text>
          </View>
          <ThemeToggle className="mr-0" swtich />
        </View>
      </Button>
      <ButtonWithIcon />
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
