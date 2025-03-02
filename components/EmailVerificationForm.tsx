import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { TextInputProps, View } from "react-native";
import Toast from "react-native-toast-message";
import {
  AccountErrors,
  checkPasswordResetToken,
  emailVerification,
  resetPassword,
} from "~/api/account";
import { usePopup } from "~/components/PopupProvider";
import { Button, ButtonProps } from "~/components/ui/button";
import { Form, FormField, FormInput } from "~/components/ui/form";
import { Text } from "~/components/ui/text";
import { getErrorsString } from "~/lib/errors";
import { useGlobalStore } from "~/lib/global-store";
import { catchErrorTyped, cn } from "~/lib/utils";
import {
  checkPasswordTokenSchema,
  CheckPasswordTokenSchema,
  emailOnlySchema,
  EmailOnlySchema,
} from "~/schemas/account.schema";

const EmailVerificationForm = ({
  label = "Địa chỉ email",
  placeholder = "Email của bạn",
  isPasswordReset = false,
  userInfo,
  className,
  children,
}: TextInputProps & {
  label?: string;
  isPasswordReset?: boolean;
  userInfo?: UserInfo;
}) => {
  const popup = usePopup();
  const router = useRouter();
  const isVerify = userInfo?.is_email_verified;
  const [canResend, setCanResend] = useState(
    isPasswordReset ? true : !isVerify
  );
  const [showTimer, setShowTimer] = useState(false);
  const [sendEmailSuccess, setSendEmailSuccess] = useState(false);
  const description = !isPasswordReset
    ? !isVerify
      ? "Địa chỉ email chưa được xác thực"
      : ""
    : "";

  const sendEmaiForm = useForm<EmailOnlySchema>({
    resolver: zodResolver(emailOnlySchema),
    defaultValues: {
      email: userInfo?.email ?? "",
    },
  });

  const checkTokenForm = useForm<CheckPasswordTokenSchema>({
    resolver: zodResolver(checkPasswordTokenSchema),
    defaultValues: {
      token: "",
    },
  });

  const handleResetPassword = async (schema: EmailOnlySchema) => {
    const [error, response] = await catchErrorTyped(resetPassword(schema), [
      AccountErrors,
    ]);

    if (error) {
      if (error instanceof AccountErrors) {
      } else {
        popup.error();
      }
    } else if (response) {
      setCanResend(false);
      setShowTimer(true);
      setSendEmailSuccess(true);
    }
  };

  const handleResendEmail = async (schema: EmailOnlySchema) => {
    const [error, response] = await catchErrorTyped(emailVerification(schema), [
      AccountErrors,
    ]);

    if (error) {
      if (error instanceof AccountErrors) {
      } else {
        popup.error();
      }
    } else if (response) {
      setCanResend(false);
      setShowTimer(true);
      Toast.show({
        type: "success",
        text1: "Thông báo",
        text2:
          "Gửi email xác nhận thành công\nVui lòng kiểm tra hòm thư của bạn",
      });
    }
  };

  const onSendEmailSubmit = async (values: EmailOnlySchema) => {
    console.log("Submit values:", values);
    const schema = emailOnlySchema.parse(values);

    useGlobalStore.setState({ isAppLoading: true });

    if (isPasswordReset) {
      await handleResetPassword(schema);
    } else {
      await handleResendEmail(schema);
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  const onCheckTokenSubmit = async (values: CheckPasswordTokenSchema) => {
    console.log("Submit values:", values);
    const schema = checkPasswordTokenSchema.parse(values);

    useGlobalStore.setState({ isAppLoading: true });

    const [error, response] = await catchErrorTyped(
      checkPasswordResetToken(schema),
      [AccountErrors<CheckPasswordTokenSchema>]
    );

    if (error) {
      checkTokenForm.setValue("token", "");

      if (error instanceof AccountErrors) {
        const errorsString = getErrorsString(error.properties);
        if (errorsString.token)
          checkTokenForm.setError("token", {
            message: errorsString.token,
          });
      }
    } else {
      router.push(`/(auth)/password-reset-confirm/${schema.token}` as any);
    }

    useGlobalStore.setState({ isAppLoading: false });
  };

  const handleTimerFinish = () => {
    setCanResend(true);
    setShowTimer(false);
  };

  return (
    <View className={cn("gap-2", className)}>
      {sendEmailSuccess ? (
        <CheckTokenForm form={checkTokenForm} />
      ) : (
        <SendEmailForm
          form={sendEmaiForm}
          isPasswordReset={isPasswordReset}
          label={label}
          description={description}
          placeholder={placeholder}
        />
      )}
      <View
        className={cn(
          "flex-row",
          sendEmailSuccess ? "justify-between" : "justify-end"
        )}
      >
        <SendEmailButton
          text={isVerify ? "Đã xác thực" : "Gửi xác thực"}
          disabled={!canResend}
          onPress={sendEmaiForm.handleSubmit(onSendEmailSubmit)}
          showResend={sendEmailSuccess}
          showTimer={showTimer}
          countdownTimer={
            <CountdownTimer initialTime={60} onFinish={handleTimerFinish} />
          }
        />
        {sendEmailSuccess && (
          <CheckTokenButton
            onPress={checkTokenForm.handleSubmit(onCheckTokenSubmit)}
          />
        )}
      </View>
    </View>
  );
};

const CheckTokenButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <Button size={"sm"} onPress={onPress}>
      <Text className="font-bold">Xác nhận</Text>
    </Button>
  );
};

const SendEmailButton = ({
  text,
  showResend,
  showTimer,
  countdownTimer,
  disabled,
  onPress,
}: ButtonProps & {
  text?: string;
  showResend?: boolean;
  showTimer?: boolean;
  countdownTimer?: React.ReactNode;
}) => {
  return (
    <Button
      variant={showResend ? "outline" : "default"}
      size={"sm"}
      disabled={disabled}
      onPress={onPress}
    >
      {showResend ? (
        <Text className="font-bold">Gửi lại {showTimer && countdownTimer}</Text>
      ) : showTimer ? (
        countdownTimer
      ) : (
        <Text className="font-bold">{text}</Text>
      )}
    </Button>
  );
};

const SendEmailForm = ({
  label,
  placeholder,
  isPasswordReset,
  description,
  form,
}: TextInputProps & {
  label: string;
  description: string;
  isPasswordReset: boolean;
  form: UseFormReturn<
    {
      email: string;
    },
    any,
    undefined
  >;
}) => {
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormInput
            label={label}
            readOnly={!isPasswordReset}
            description={description}
            placeholder={placeholder}
            keyboardType="email-address"
            {...field}
          />
        )}
      />
    </Form>
  );
};

const CheckTokenForm = ({
  form,
}: {
  form: UseFormReturn<
    {
      token: string;
    },
    any,
    undefined
  >;
}) => {
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="token"
        render={({ field }) => (
          <FormInput
            label="Mã xác nhận"
            description="Vui lòng kiểm tra hòm thư của bạn và nhập mã xác nhận"
            placeholder="Mã xác nhận của bạn"
            {...field}
          />
        )}
      />
    </Form>
  );
};

const CountdownTimer = ({
  initialTime,
  onFinish,
}: {
  initialTime: number;
  onFinish: () => void;
}) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time > 0) {
      const timerId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      console.log("TimeDown Finished!");
      onFinish();
    }
  }, [time]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes > 0 ? `${minutes}m:` : ""}${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}s`;
  };

  return <Text className="font-bold">{formatTime(time)}</Text>;
};

export default EmailVerificationForm;
