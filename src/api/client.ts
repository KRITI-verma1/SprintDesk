/**
 * API Client with Bearer Token Interceptor & Silent Token Refresh
 */

let inMemoryAccessToken: string | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

export const getAccessToken = (): string | null => inMemoryAccessToken;

export const setAccessToken = (token: string | null): void => {
  inMemoryAccessToken = token;
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem('sprintdesk_refresh_token');
};

export const setRefreshToken = (token: string | null): void => {
  if (token) {
    localStorage.setItem('sprintdesk_refresh_token', token);
  } else {
    localStorage.removeItem('sprintdesk_refresh_token');
  }
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

export interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  _retry?: boolean;
}

export async function apiClient<T = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { skipAuth = false, _retry = false, headers = {}, ...rest } = options;

  const requestHeaders = new Headers(headers);

  // Attach Bearer Token if present and not explicitly skipped
  if (!skipAuth && inMemoryAccessToken) {
    requestHeaders.set('Authorization', `Bearer ${inMemoryAccessToken}`);
  }

  if (!requestHeaders.has('Content-Type') && !(rest.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...rest,
      headers: requestHeaders,
    });

    // Handle 401 Unauthorized - Silent Refresh & Retry
    if (response.status === 401 && !_retry && !skipAuth) {
      const storedRefreshToken = getRefreshToken();

      if (!storedRefreshToken) {
        setAccessToken(null);
        throw new Error('Session expired. Please log in again.');
      }

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Call DummyJSON refresh endpoint
          const refreshRes = await fetch('https://dummyjson.com/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              refreshToken: storedRefreshToken,
              expiresInMins: 60,
            }),
          });

          if (!refreshRes.ok) {
            throw new Error('Token refresh failed');
          }

          const refreshData = await refreshRes.json();
          const newToken = refreshData.accessToken || refreshData.token;
          const newRefreshToken = refreshData.refreshToken || storedRefreshToken;

          setAccessToken(newToken);
          setRefreshToken(newRefreshToken);
          isRefreshing = false;
          onRefreshed(newToken);

          // Retry the original request with the new token
          return apiClient<T>(url, {
            ...options,
            _retry: true,
          });
        } catch (refreshErr) {
          isRefreshing = false;
          setAccessToken(null);
          setRefreshToken(null);
          throw refreshErr;
        }
      }

      // If already refreshing, wait for the new token and retry
      return new Promise<T>((resolve, reject) => {
        addRefreshSubscriber(async (token: string) => {
          try {
            const retryHeaders = new Headers(headers);
            retryHeaders.set('Authorization', `Bearer ${token}`);
            const retryRes = await fetch(url, {
              ...rest,
              headers: retryHeaders,
            });
            const data = await retryRes.json();
            resolve(data as T);
          } catch (err) {
            reject(err);
          }
        });
      });
    }

    if (!response.ok) {
      const errorBody = await response.text();
      let parsedError: { message?: string } | null = null;
      try {
        parsedError = JSON.parse(errorBody);
      } catch {
        // Fallback to text
      }
      throw new Error(parsedError?.message || `Request failed with status ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    throw error;
  }
}
