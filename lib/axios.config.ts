import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  isAxiosError,
} from "axios";
import { DEFAULT, STORAGE_KEYS } from "~/lib/constants";
import { AppErrors } from "~/lib/errors";
import storage from "~/lib/storage";

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

const instance = axios.create({
  baseURL: DEFAULT.BASE_API_URL,
  headers: DEFAULT_HEADERS,
  withCredentials: false,
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
    ...(withToken && authTokens && { Authorization: `Bearer ${authTokens}` }),
  };
  return overide && headers ? headers : { ...defaultHeaders, ...headers };
};

interface Request {
  url: string;
  methord: "get" | "post" | "put" | "delete";
  data?: any;
  config?: AxiosRequestConfig<any>;
}

export class ApiErrors extends AppErrors {
  name = "ApiErrors";

  constructor(error?: AppError) {
    super(error);
  }

  static NetworkError: AppError = {
    code: "NETWORK_ERROR",
    message:
      "Không thể kết nối đến máy chủ.\nVui lòng kiểm tra kết nối mạng và thử lại.",
  };
  static networkError() {
    return new ApiErrors(this.NetworkError);
  }
}

const request = async <TResponse, TInput = any>({
  url,
  methord,
  data,
  config,
}: Request) => {
  console.log("Request:", JSON.stringify({ url, methord, data, config }));
  try {
    const response = await instance[methord]<TInput, AxiosResponse<TResponse>>(
      url,
      data,
      config
    );
    console.log("Response:", response.data);
    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.code === AxiosError.ERR_NETWORK) {
        throw ApiErrors.networkError();
      }
    }
    throw error;
  }
};

const get = async <TResponse, TInput = any>(
  url: string,
  config?: AxiosRequestConfig<any>
) => {
  return request<TResponse, TInput>({
    url,
    methord: "get",
    config,
  });
};

const deleteReq = async <TResponse, TInput = any>(
  url: string,
  config?: { params?: any; headers?: any }
) => {
  return request<TResponse, TInput>({
    url,
    methord: "delete",
    config,
  });
};

const post = async <TResponse, TInput = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any>
) => {
  return request<TResponse, TInput>({
    url,
    methord: "post",
    data,
    config,
  });
};

const put = async <TResponse, TInput = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any>
) => {
  return request<TResponse, TInput>({
    url,
    methord: "put",
    data,
    config,
  });
};

const api = { get, post, put, delete: deleteReq, request, getHeaders };

export default api;
