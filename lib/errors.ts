import { AxiosError } from "axios";
import { STORAGE_KEYS } from "~/lib/constants";
import { useGlobalStore } from "~/lib/global-store";
import storage from "~/lib/storage";

const handleError = (error: AxiosError) => {
  if (error.code === AxiosError.ERR_NETWORK) {
    throw "Không thể kết nối đến máy chủ.\nVui lòng kiểm tra kết nối mạng và thử lại.";
  }

  if (error.response) {
    if (error.response.status === 400) {
      throw "Email hoặc mật khẩu không chính xác";
    }
    if (error.response.status === 401) {
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_INFO);
      useGlobalStore.setState({
        isAuthenticated: false,
        authToken: null,
        userInfo: null,
      });
      throw "Phiên đăng nhập đã hết hạn";
    }
  }

  return "Lỗi không xác định";
};

export default {
  handleError,
};
