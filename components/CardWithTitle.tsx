import { View } from "react-native";
import React from "react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Text } from "~/components/ui/text";

interface ProfileContentCardProps {
  title?: string;
  children?: React.ReactNode;
}

const CardWithTitle = ({ title, children }: ProfileContentCardProps) => {
  return (
    <Card>
      <CardHeader className="px-4 pt-3 pb-1">
        <Text className="text-xs text-muted-foreground">{title}</Text>
      </CardHeader>
      <CardContent className="px-4 pb-3">{children}</CardContent>
    </Card>
  );
};

export default CardWithTitle;
