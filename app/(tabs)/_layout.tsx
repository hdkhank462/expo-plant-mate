import { Tabs } from "expo-router";
import React from "react";
import MenuButtonLink from "~/components/MenuButtonLink";
import { Home } from "~/lib/icons/Home";
import { User } from "~/lib/icons/User";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          height: 70,
        },
        animation: "fade",
        headerTitleAlign: "center",
        headerLeft: () => <MenuButtonLink />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Home size={24} strokeWidth={1.25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <User size={24} strokeWidth={1.25} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
