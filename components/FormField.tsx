import React from "react";
import { TextInputProps, View, Text } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Eye } from "~/lib/icons/Eye";
import { EyeOff } from "~/lib/icons/EyeOff";
import { cn } from "~/lib/utils";

interface FormFieldProps extends TextInputProps {
  title?: string;
  password?: boolean;
  required?: boolean;
  className?: string;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  children?: React.ReactNode;
  errorMessage?: string;
}

const FormField = (props: FormFieldProps) => {
  const [visible, setVisible] = React.useState(props.password);
  const toggleVisible = () => setVisible(!visible);

  return (
    <View className={cn("gap-1.5", props.className)}>
      {props.title && (
        <Label nativeID={props.nativeID}>
          <Text className="text-sm font-bold">{props.title}</Text>
          {props.required && (
            <Text className="text-sm text-destructive">*</Text>
          )}
        </Label>
      )}
      <View className="relative">
        {props.iconStart && props.iconStart}
        <Input
          className={props.errorMessage && "border border-destructive"}
          secureTextEntry={visible}
          {...props}
        />
        {props.iconEnd
          ? props.iconEnd
          : props.password && (
              <PasswordToggleButton visible={visible} onPress={toggleVisible} />
            )}
      </View>
      <Text
        className={cn(
          "text-sm text-destructive",
          !props.errorMessage && "invisible"
        )}
      >
        {props.errorMessage ?? "No error"}
      </Text>
      {props.children}
    </View>
  );
};

const PasswordToggleButton = ({
  visible,
  onPress,
}: {
  visible?: boolean;
  onPress?: () => void;
}) => {
  return (
    <Button
      variant={"ghost"}
      size={"icon"}
      onPress={onPress}
      className="absolute top-1 right-1"
    >
      {visible ? (
        <Eye className="text-muted-foreground" size={20} />
      ) : (
        <EyeOff className="text-muted-foreground" size={20} />
      )}
    </Button>
  );
};

export default FormField;
