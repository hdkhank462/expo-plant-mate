import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from "axios";
import Toast from "react-native-toast-message";
import { DEFAULT, STORAGE_KEYS } from "~/constants/values";
import { AppErrors } from "~/lib/errors";
import { useStore } from "~/stores/index";
import storage from "~/lib/storage";

const refreshToken = async () => {
  try {
    console.log("Refreshing token");

    const response = await request<RefreshTokenResponse>({
      url: "/auth/token/refresh/",
      method: "post",
    });

    const authToken: AuthToken = {
      access: response.data.access,
      refresh: "",
    };

    useStore.setState({ authToken });
    await storage.set(STORAGE_KEYS.AUTH_TOKEN, authToken);
    return new AppErrors(AppErrors.Unauthorized);
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Thông báo",
      text2: AppErrors.SessionExpired.message,
    });

    useStore.setState({
      isAuthenticated: false,
      authToken: null,
      userInfo: null,
    });

    // Remove from storage
    await storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    await storage.remove(STORAGE_KEYS.USER_INFO);
    return new AppErrors(AppErrors.SessionExpired);
  }
};

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const instance = axios.create({
  baseURL: DEFAULT.BASE_API_URL,
  headers: DEFAULT_HEADERS,
  withCredentials: true,
  timeout: 10000,
});

const getHeaders = async ({
  withToken,
  headers,
  overide,
}: {
  withToken?: boolean;
  overide?: boolean;
  headers?: any;
}) => {
  const authTokens = await storage.get<AuthToken>(STORAGE_KEYS.AUTH_TOKEN);
  const defaultHeaders = {
    ...DEFAULT_HEADERS,
    ...(withToken &&
      authTokens && { Authorization: `Bearer ${authTokens.access}` }),
  };
  return overide && headers ? headers : { ...defaultHeaders, ...headers };
};

interface Request {
  url: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  data?: any;
  configs?: AxiosRequestConfig<any> & {
    refreshTokenOnUnauthorized?: boolean;
  };
}

const request = async <TResponse, TInput = any>({
  url,
  method,
  data,
  configs = { refreshTokenOnUnauthorized: true },
}: Request) => {
  console.log(
    "Request:",
    JSON.stringify({ url, method, data, configs }, null, 2)
  );
  try {
    if (method === "get" || method === "delete") {
      data = { ...configs, ...data };
    }

    const response = await instance[method]<TInput, AxiosResponse<TResponse>>(
      url,
      data,
      configs
    );
    // console.log("Full Request", JSON.stringify(response.request, null, 2));
    // console.log("Full Response:", JSON.stringify(response, null, 2));
    console.log("Response Data:", JSON.stringify(response.data, null, 2));
    return response;
  } catch (error: any) {
    console.log(
      "Error Response Data:",
      JSON.stringify(error?.response?.data, null, 2)
    );

    if (isAxiosError(error)) {
      if (error.code === AxiosError.ERR_NETWORK) {
        Toast.show({
          type: "error",
          text1: "Thông báo",
          text2: AppErrors.NetworkError.message,
        });
        throw AppErrors.networkError({ cause: error });
      }

      // Handle unauthorized & refresh token
      if (
        error.response?.data?.code !== "token_not_valid" &&
        error.response?.status === 401 &&
        configs?.refreshTokenOnUnauthorized
      )
        throw await refreshToken();
    }
    throw error;
  }
};

const api = { request, getHeaders };

export default api;
