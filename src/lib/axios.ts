import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let refreshing: Promise<unknown> | null = null;

// One refresh at a time: the server replaces the refresh token, so a second call with the old one would fail
function refreshSession() {
  refreshing ??= axios
    .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/refresh`, null, {
      withCredentials: true,
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

// The access token lasts an hour and the refresh token a week. When the first one has expired, renew it and replay
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError & { config?: InternalAxiosRequestConfig & { _retry?: boolean } }) => {
    const request = error.config;
    const isLoginOrRefresh = /\/auth\/(login|refresh)/.test(request?.url ?? "");

    if (error.response?.status !== 401 || !request || request._retry || isLoginOrRefresh) {
      throw error;
    }
    request._retry = true;

    try {
      await refreshSession();
    } catch {
      // a visitor, or a session that is really over: the caller gets the original 401
      throw error;
    }
    return api(request);
  }
);

export default api;
