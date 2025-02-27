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
    ...(withToken &&
      authTokens && { Authorization: `Bearer ${authTokens.access}` }),
  };
  return overide && headers ? headers : { ...defaultHeaders, ...headers };
};

interface Request {
  url: string;
  method: "get" | "post" | "put" | "delete";
  data?: any;
  config?: AxiosRequestConfig<any>;
}

const request = async <TResponse, TInput = any>({
  url,
  method,
  data,
  config,
}: Request) => {
  console.log(
    "Request:",
    JSON.stringify({ url, method, data, config }, null, 2)
  );
  try {
    if (method === "get" || method === "delete") {
      data = { ...config, ...data };
    }

    const response = await instance[method]<TInput, AxiosResponse<TResponse>>(
      url,
      data,
      config
    );
    console.log("Response:", JSON.stringify(response.data, null, 2));
    return response;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.code === AxiosError.ERR_NETWORK) {
        throw AppErrors.networkError();
      }
    }
    throw error;
  }
};

const get = async <TResponse, TInput = any>(
  url: string,
  config?: AxiosRequestConfig<any>
) => {
  return instance.get<TInput, AxiosResponse<TResponse>>(url, config);
};

const deleteReq = async <TResponse, TInput = any>(
  url: string,
  config?: AxiosRequestConfig<any>
) => {
  return instance.delete<TInput, AxiosResponse<TResponse>>(url, config);
};

const post = async <TResponse, TInput = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any>
) => {
  return instance.post<TInput, AxiosResponse<TResponse>>(url, data, config);
};

const put = async <TResponse, TInput = any>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any>
) => {
  return instance.put<TInput, AxiosResponse<TResponse>>(url, data, config);
};

const api = { get, post, put, delete: deleteReq, request, getHeaders };

export default api;
