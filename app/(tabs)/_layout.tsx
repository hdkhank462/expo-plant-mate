import { Tabs } from "expo-router";
import React from "react";
import SearchButtonLink from "~/components/SearchButtonLink";
import { Home } from "~/lib/icons/Home";
import { User } from "~/lib/icons/User";
import { Leaf } from "~/lib/icons/Leaf";
import TabsContainer from "~/components/TabsContainer";

const TabsLayout = () => {
  return (
    <TabsContainer
      tabBarActiveClassName="bg-background text-primary"
      tabBarInactiveClassName="bg-background text-primary/50"
      screenOptions={{
        headerStyle: {
          height: 76,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
        animation: "fade",
        headerTitleAlign: "center",
        headerLeft: () => <SearchButtonLink />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ focused, color, size }) => (
            <Home
              size={size}
              strokeWidth={focused ? 1.75 : 1.25}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plant-list"
        options={{
          title: "Plant list",
          tabBarIcon: ({ focused, color, size }) => (
            <Leaf
              size={size}
              strokeWidth={focused ? 1.75 : 1.25}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Bạn",
          tabBarIcon: ({ focused, color, size }) => (
            <User
              size={size}
              strokeWidth={focused ? 1.75 : 1.25}
              color={color}
            />
          ),
        }}
      />
    </TabsContainer>
  );
};

export default TabsLayout;
