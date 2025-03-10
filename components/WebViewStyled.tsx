import { cssInterop } from "nativewind";
import WebView, { WebViewProps } from "react-native-webview";

const WebViewStyled = ({ style, ...props }: WebViewProps) => {
  return <WebView style={style} {...props} />;
};

cssInterop(WebViewStyled, {
  className: {
    target: "style",
  },
});

export default WebViewStyled;
