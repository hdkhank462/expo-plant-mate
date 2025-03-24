import { StyleSheet } from "nativewind";
import React from "react";
import { ActivityIndicator, View } from "react-native";
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

const TfliteDetector = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");
  const model = useTensorflowModel(require("../assets/weight_32.tflite"));
  const actualModel = model.state === "loaded" ? model.model : undefined;

  React.useEffect(() => {
    if (actualModel == null) return;
    console.log(`Model loaded! Shape:\n${modelToString(actualModel)}]`);
  }, [actualModel]);

  const { resize } = useResizePlugin();

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";
      if (actualModel == null) {
        // model is still loading...
        return;
      }

      console.log(`Running inference on ${frame}`);
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
      console.log("Result: " + num_detections);
    },
    [actualModel]
  );

  React.useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  console.log(`Model: ${model.state} (${model.model != null})`);

  return (
    <View>
      {hasPermission && device != null ? (
        <Camera
          device={device}
          style={StyleSheet.absoluteFill}
          isActive={true}
          frameProcessor={frameProcessor}
          pixelFormat="yuv"
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
  );
};

export default TfliteDetector;
