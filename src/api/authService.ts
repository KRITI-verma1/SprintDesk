import { apiClient, setAccessToken, setRefreshToken, getRefreshToken } from './client';
import { AuthUser, LoginResponse } from '../types/auth';

const DUMMYJSON_URL = 'https://dummyjson.com';

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const data = await apiClient<LoginResponse>(`${DUMMYJSON_URL}/auth/login`, {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({
        username,
        password,
        expiresInMins: 60,
      }),
    });

    const accessToken = data.accessToken || data.token || '';
    const refreshToken = data.refreshToken || '';

    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    return data;
  },

  async refreshToken(): Promise<{ accessToken: string; refreshToken?: string }> {
    const currentRefreshToken = getRefreshToken();
    if (!currentRefreshToken) {
      throw new Error('No refresh token available');
    }

    const data = await apiClient<{ accessToken?: string; token?: string; refreshToken?: string }>(
      `${DUMMYJSON_URL}/auth/refresh`,
      {
        method: 'POST',
        skipAuth: true,
        body: JSON.stringify({
          refreshToken: currentRefreshToken,
          expiresInMins: 60,
        }),
      }
    );

    const token = data.accessToken || data.token || '';
    setAccessToken(token);
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
    return { accessToken: token, refreshToken: data.refreshToken };
  },

  async getCurrentUser(): Promise<AuthUser> {
    return apiClient<AuthUser>(`${DUMMYJSON_URL}/auth/me`);
  },

  logout(): void {
    setAccessToken(null);
    setRefreshToken(null);
  },
};
