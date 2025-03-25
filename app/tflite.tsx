import { useIsFocused } from "@react-navigation/native";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import {
  Tensor,
  TensorflowModel,
  useTensorflowModel,
} from "react-native-fast-tflite";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { Text } from "~/components/ui/text";

function tensorToString(tensor: Tensor): string {
  return `\n  - ${tensor.dataType} ${tensor.name}[${tensor.shape}]`;
}
function modelToString(model: TensorflowModel): string {
  return (
    `TFLite Model (${model.delegate}):\n` +
    `- Inputs: ${model.inputs.map(tensorToString).join("")}\n` +
    `- Outputs: ${model.outputs.map(tensorToString).join("")}`
  );
}

const FPS_LIMIT = 30;

const TfliteDetectorScreen = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const isFocused = useIsFocused();
  const device = useCameraDevice("back");
  const model = useTensorflowModel(require("~/assets/weight_32.tflite"));
  const modelGPU = useTensorflowModel(
    require("~/assets/weight_32.tflite"),
    Platform.OS === "ios" ? "core-ml" : "nnapi"
  );

  const actualModel =
    modelGPU.state === "loaded"
      ? modelGPU.model
      : model.state === "loaded"
      ? model.model
      : null;

  React.useEffect(() => {
    if (actualModel == null) return;
    console.log(`Model loaded! Shape:\n${modelToString(actualModel)}]`);
  }, [actualModel]);

  const { resize } = useResizePlugin();

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      if (actualModel == null || !isFocused) {
        // model is still loading...
        return;
      }

      console.log("Processing frame...");

      try {
        const resized = resize(frame, {
          scale: {
            width: 320,
            height: 320,
          },
          pixelFormat: "rgb",
          dataType: "uint8",
        });

        const result = actualModel.runSync([resized]);
        const num_detections = result[3]?.[0] ?? 0;
        console.log("Nums: " + num_detections);
      } catch (error) {
        console.error("Frame processing error:", error);
      }
    },
    [actualModel, isFocused]
  );

  React.useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  console.log(`Model: ${model.state} (${model.model != null})`);

  return (
    <SafeAreaView className="h-full">
      <View className="h-full pt-7">
        {hasPermission && device != null ? (
          <Camera
            device={device}
            style={StyleSheet.absoluteFill}
            isActive={isFocused}
            frameProcessor={frameProcessor}
            pixelFormat="yuv"
            enableBufferCompression={true}
            lowLightBoost={false}
          />
        ) : (
          <Text>No Camera available.</Text>
        )}

        {model.state === "loading" && (
          <ActivityIndicator size="small" color="white" />
        )}

        {model.state === "error" && (
          <Text>Failed to load model! {model.error.message}</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TfliteDetectorScreen;
