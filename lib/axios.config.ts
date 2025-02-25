import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { DEFAULT, STORAGE_KEYS } from "~/lib/constants";
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

const request = async <TResponse, TInput = any>({
  url,
  methord,
  data,
  config,
}: Request) => {
  try {
    return instance[methord]<TInput, AxiosResponse<TResponse>>(
      url,
      data,
      config
    );
  } catch (error) {
    return Promise.reject(error);
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
