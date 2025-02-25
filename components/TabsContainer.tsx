/*
 * https://github.com/nativewind/nativewind/issues/682#issuecomment-1866852895
 */

import { Tabs } from "expo-router";
import { cssInterop } from "nativewind";
import { Button } from "~/components/ui/button";

const TabsContainer = ({
  tabBarActiveTintColor,
  tabBarInactiveTintColor,
  tabBarActiveBackgroundColor,
  tabBarInactiveBackgroundColor,
  tabBarBackgroundColor,
  screenOptions,
  children,
  ...props
}: any) => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor,
        tabBarInactiveTintColor,
        tabBarActiveBackgroundColor,
        tabBarInactiveBackgroundColor,
        ...screenOptions,
      }}
      {...props}
    >
      {children}
    </Tabs>
  );
};

/*
 * Translate nativewind classes to values that we can use to style the react-navigation <Stack> component.
 */
cssInterop(TabsContainer, {
  // headerClassName: {
  //     target: false,
  //     nativeStyleToProp: {
  //       backgroundColor: "headerBackgroundColor",
  //       color: "headerTintColor",
  //     },
  //   },
  // tabBarClassName: {
  //   target: false,
  //   nativeStyleToProp: {
  //     backgroundColor: "tabBarBackgroundColor",
  //   },
  // },
  tabBarActiveClassName: {
    target: false,
    nativeStyleToProp: {
      backgroundColor: "tabBarActiveBackgroundColor",
      color: "tabBarActiveTintColor",
    },
  },
  tabBarInactiveClassName: {
    target: false,
    nativeStyleToProp: {
      backgroundColor: "tabBarInactiveBackgroundColor",
      color: "tabBarInactiveTintColor",
    },
  },
});

export default TabsContainer;
