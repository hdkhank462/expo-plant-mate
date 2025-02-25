import { Tabs } from "expo-router";
import React from "react";
import MenuButtonLink from "~/components/MenuButtonLink";
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
          height: 70,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
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
          title: "Profile",
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
