import { cssInterop } from "nativewind";
import React from "react";
import { RefreshControl } from "react-native";

const Refresher = ({
  progressBackgroundColor,
  indicatorColor,
  ...props
}: any) => {
  return (
    <RefreshControl
      colors={[indicatorColor]}
      progressBackgroundColor={progressBackgroundColor}
      {...props}
    />
  );
};

cssInterop(Refresher, {
  className: {
    target: false,
    nativeStyleToProp: {
      backgroundColor: "progressBackgroundColor",
      color: "indicatorColor",
    },
  },
});

export default Refresher;
