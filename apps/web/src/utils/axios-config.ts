import axios from 'axios';
import { AppStorage, StorageKeys } from './storage';
import { refreshAuthTokens } from './token';

export const AxiosPublic = axios.create({
  headers: {
    Accept: 'application/json',
    'Content-type': 'application/json',
  },
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const handleResponseSuccess = (response: any) => {
  return response;
};

AxiosPublic.interceptors.request.use(
  config => {
    const token = AppStorage.getItem<string>(StorageKeys.ACCESS_TOKEN);
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }

      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    Promise.reject(error);
  },
);

AxiosPublic.interceptors.response.use(
  response => handleResponseSuccess(response),
  async error => {
    const originalRequest = error.config;
    if (error?.responspe?.status === 401 && !originalRequest._retry) {
      // tag a retry
      originalRequest._retry = true;

      // refresh auth tokens
      const { isRefreshTokenExpired, accessToken } = await refreshAuthTokens();

      // if refresh token not already expired, retry call
      if (!isRefreshTokenExpired) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        return AxiosPublic(originalRequest);
      }
    }

    // reach here if refresh token expired or call failed again on retry with refresh token

    // redirect to login on 401
    if (error?.responspe?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/';
      return;
    }

    // reject otherwise
    return Promise.reject(error);
  },
);
