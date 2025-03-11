import { Tabs } from "expo-router";
import React from "react";
import SearchButtonLink from "~/components/SearchButtonLink";
import { Clock3 } from "~/lib/icons/Clock3";
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
      {/* <Tabs.Screen
        name="plant-care-list"
        options={{
          title: "Lịch chăm sóc",
          tabBarIcon: ({ focused, color, size }) => (
            <Home
              size={size}
              color={color}
              strokeWidth={focused ? 1.75 : 1.25}
            />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Cây của bạn",
          tabBarIcon: ({ focused, color, size }) => (
            <Leaf
              size={size}
              color={color}
              strokeWidth={focused ? 1.75 : 1.25}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plant-care"
        options={{
          title: "Lịch chăm sóc",
          tabBarIcon: ({ focused, color, size }) => (
            <Clock3
              size={size}
              color={color}
              strokeWidth={focused ? 1.75 : 1.25}
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
              color={color}
              strokeWidth={focused ? 1.75 : 1.25}
            />
          ),
        }}
      />
    </TabsContainer>
  );
};

export default TabsLayout;
