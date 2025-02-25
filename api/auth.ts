import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { AxiosError, isAxiosError } from "axios";
import api from "~/lib/axios.config";
import { STORAGE_KEYS } from "~/lib/constants";
import { useGlobalStore } from "~/lib/global-store";
import storage from "~/lib/storage";
import { LoginSchema } from "~/schemas/auth.schema";

const loginWithCreds = async (schema: LoginSchema) => {
  let response: ApiResponse<LoginError, UserInfo> = {
    isSuccess: false,
  };

  try {
    const apiResponse = await api.post<LoginResponse>("/auth/login", {
      ...schema,
    });
    useGlobalStore.setState({ userInfo: apiResponse.data.user });
    storage.set(STORAGE_KEYS.USER_INFO, apiResponse);
    response.isSuccess = true;
    response.data = apiResponse.data.user;
  } catch (error) {
    if (isAxiosError(error)) {
      response.error = { ...handleError(error) };
    }
  } finally {
    console.log(
      "Login with cridentials response:",
      JSON.stringify(response, null, 2)
    );
    return response;
  }
};

const loginWithGoogle = async () => {
  let response: ApiResponse<ApiError, UserInfo> = {
    isSuccess: false,
  };

  try {
    const signInResponse = await GoogleSignin.signIn();
    if (!isSuccessResponse(signInResponse)) return response;

    const access_token = (await GoogleSignin.getTokens()).accessToken;
    const apiResponse = await api.post<LoginResponse>("/auth/google/", {
      access_token,
    });
    useGlobalStore.setState({ userInfo: apiResponse.data.user });
    storage.set(STORAGE_KEYS.USER_INFO, apiResponse);
    response.isSuccess = true;
    response.data = apiResponse.data.user;
  } catch (error) {
    if (isAxiosError(error)) {
      response.error = { ...handleError(error) };
    }
  } finally {
    console.log(
      "Login with Google response:",
      JSON.stringify(response, null, 2)
    );
    return response;
  }
};

const getUserInfo = async () => {
  let response: ApiResponse<ApiError, UserInfo> = {
    isSuccess: false,
  };

  try {
    const headers = await api.getHeaders({ withToken: true });
    const apiResponse = await api.get<UserInfo>("/auth/user", { headers });
    response.data = apiResponse.data;
    response.isSuccess = true;
  } catch (error) {
    if (isAxiosError(error)) {
      response.error = { ...handleError(error) };
    }
  } finally {
    console.log("Get user info response:", JSON.stringify(response, null, 2));
    return response;
  }
};

const logout = async () => {
  console.log("Logging out");

  try {
    useGlobalStore.setState({
      userInfo: null,
      authToken: null,
      isAuthenticated: false,
    });

    if (GoogleSignin.hasPreviousSignIn()) {
      await GoogleSignin.signOut();
    }

    await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    await storage.remove(STORAGE_KEYS.USER_INFO);
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

const handleError = (error: AxiosError) => {
  if (error.code === AxiosError.ERR_NETWORK) {
    return {
      non_field_errors:
        "Không thể kết nối đến máy chủ.\nVui lòng kiểm tra kết nối mạng và thử lại.",
    };
  }

  if (error.response) {
    if (error.response.status === 400) {
      return { password: "Email hoặc mật khẩu không chính xác" };
    }
    if (error.response.status === 401) {
      storage.remove(STORAGE_KEYS.AUTH_TOKEN);
      storage.remove(STORAGE_KEYS.USER_INFO);
      useGlobalStore.setState({
        isAuthenticated: false,
        authToken: null,
        userInfo: null,
      });
      return null;
    }
  }
};

export default {
  loginWithCreds,
  loginWithGoogle,
  logout,
  getUserInfo,
};
