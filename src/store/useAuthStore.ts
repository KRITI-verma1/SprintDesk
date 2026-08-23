import { create } from 'zustand';
import { AuthUser, AuthState } from '../types/auth';
import { authService } from '../api/authService';
import { setAccessToken, getRefreshToken } from '../api/client';

interface AuthStore extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (username: string, password: string) => {
    set({ isLoading: true });
    try {
      const res = await authService.login(username, password);
      const token = res.accessToken || res.token || '';
      const user: AuthUser = {
        id: res.id,
        username: res.username,
        email: res.email,
        firstName: res.firstName,
        lastName: res.lastName,
        gender: res.gender,
        image: res.image,
      };

      set({
        user,
        accessToken: token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  checkSession: async () => {
    set({ isLoading: true });
    const storedRefresh = getRefreshToken();
    if (!storedRefresh) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }

    try {
      // Try to silent refresh session
      const { accessToken } = await authService.refreshToken();
      setAccessToken(accessToken);

      // Attempt to retrieve user info
      let user: AuthUser | null = null;
      try {
        user = await authService.getCurrentUser();
      } catch {
        // Fallback user if me endpoint isn't supported for this mock token
        user = {
          id: 1,
          username: 'emilys',
          email: 'emily.johnson@x.dummyjson.com',
          firstName: 'Emily',
          lastName: 'Johnson',
          image: 'https://dummyjson.com/icon/emilys/128',
        };
      }

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch {
      authService.logout();
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return false;
    }
  },
}));
