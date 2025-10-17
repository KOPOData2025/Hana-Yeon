import Axios, { type AxiosRequestConfig } from "axios";

const axios = Axios.create();

// 개발 환경에서 모바일 접속 시 자동으로 네트워크 IP 사용
export const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl;
  // 개발 환경에서 현재 호스트의 IP 사용
  if (import.meta.env.DEV && window.location.hostname !== "localhost") {
    const hostname = window.location.hostname;
    return `http://${hostname}:8080`;
  }

  return "http://localhost:8080";
};

const BASE_URL = getBaseUrl();

axios.defaults.withCredentials = true;

export const API = {
  get: async <Response>(url: string, config?: AxiosRequestConfig) => {
    return axios
      .get<Response>(`${BASE_URL}${url}`, {
        ...config,
        withCredentials: true,
      })
      .then((res) => res.data);
  },
  post: async <Response, Body = unknown>(
    url: string,
    data?: Body,
    config?: AxiosRequestConfig<Body>
  ) => {
    return axios
      .post<Response>(`${BASE_URL}${url}`, data, {
        ...config,
        withCredentials: true,
      })
      .then((res) => res.data);
  },
  put: async <Response, Body = unknown>(
    url: string,
    data?: Body,
    config?: AxiosRequestConfig<Body>
  ) => {
    return axios
      .put<Response>(`${BASE_URL}${url}`, data, {
        ...config,
        withCredentials: true,
      })
      .then((res) => res.data);
  },
};

export const API_EXTERNAL = {
  get: async <Response>(url: string, config?: AxiosRequestConfig) => {
    return axios
      .get<Response>(url, {
        ...config,
        withCredentials: true,
      })
      .then((res) => res.data);
  },
  post: async <Response, Body = unknown>(
    url: string,
    data?: Body,
    config?: AxiosRequestConfig<Body>
  ) => {
    return axios
      .post<Response>(url, data, {
        ...config,
        withCredentials: true,
      })
      .then((res) => res.data);
  },
};
