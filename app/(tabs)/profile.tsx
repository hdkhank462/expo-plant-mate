import React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import UnauthenticatedView from "~/components/UnauthenticatedView";
import { useGlobalStore } from "~/lib/global-store";
import { CalendarClock } from "~/lib/icons/CalendarClock";
import { LogOut } from "~/lib/icons/LogOut";

const ProfileScreen = () => {
  const userInfo = useGlobalStore((state) => state.userInfo);

  return (
    <View className="flex-1 p-4 bg-secondary/30">
      {userInfo ? <ProfileView userInfo={userInfo} /> : <UnauthenticatedView />}
    </View>
  );
};

const ProfileView = ({ userInfo }: { userInfo: UserInfo }) => {
  const logout = useGlobalStore((state) => state.logout);

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="gap-4">
          <View className="items-center gap-2">
            <Avatar alt="Avatar" className="w-24 h-24">
              <AvatarImage
                source={{
                  uri: userInfo.avatar_url ?? userInfo.social_avatar_url,
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
          <ProfileContentCard title="Ngày tham gia">
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
          </ProfileContentCard>

          <Button
            variant={"outline"}
            onPress={logout}
            className="items-start shadow-sm shadow-foreground/5"
          >
            <View className="flex-row items-center gap-2">
              <LogOut className="text-destructive" size={16} strokeWidth={2} />
              <Text className="font-bold text-destructive group-active:text-destructive">
                Đăng xuất
              </Text>
            </View>
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface ProfileContentCardProps {
  title?: string;
  children?: React.ReactNode;
}

const ProfileContentCard = ({ title, children }: ProfileContentCardProps) => {
  return (
    <Card>
      <CardHeader className="px-4 pt-3 pb-1">
        <Text className="text-sm font-bold text-muted-foreground">{title}</Text>
      </CardHeader>
      <CardContent className="px-4 pb-3">{children}</CardContent>
    </Card>
  );
};

export default ProfileScreen;
