import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  apiClient,
  setAccessToken,
  setRefreshToken,
  getAccessToken,
  getRefreshToken,
} from '../api/client';

describe('Auth Interceptor & Silent Refresh', () => {
  beforeEach(() => {
    localStorage.clear();
    setAccessToken(null);
    setRefreshToken(null);
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should attach Authorization Bearer header when access token is present', async () => {
    setAccessToken('valid-mock-token-123');

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    } as unknown as Response);

    await apiClient('https://api.example.com/test-endpoint');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledHeaders = fetchSpy.mock.calls[0][1]?.headers as Headers;
    expect(calledHeaders.get('Authorization')).toBe('Bearer valid-mock-token-123');
  });

  it('should intercept 401 error, silently refresh token, and retry the request', async () => {
    setAccessToken('expired-access-token');
    setRefreshToken('valid-refresh-token-456');

    // 1st call: Original request returns 401 Unauthorized
    // 2nd call: Refresh request to https://dummyjson.com/auth/refresh returns new tokens
    // 3rd call: Retried original request returns 200 OK
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => JSON.stringify({ message: 'Token expired' }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          accessToken: 'fresh-new-access-token-789',
          refreshToken: 'fresh-new-refresh-token-999',
        }),
      } as unknown as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ data: 'Secret sprint payload' }),
      } as unknown as Response);

    const result = await apiClient<{ data: string }>('https://dummyjson.com/auth/me');

    // Verify all 3 fetch calls occurred
    expect(fetchSpy).toHaveBeenCalledTimes(3);

    // Verify token was updated in memory and storage
    expect(getAccessToken()).toBe('fresh-new-access-token-789');
    expect(getRefreshToken()).toBe('fresh-new-refresh-token-999');

    // Verify result was returned from the retried request
    expect(result).toEqual({ data: 'Secret sprint payload' });
  });

  it('should fail with error if no refresh token is available on 401', async () => {
    setAccessToken('expired-access-token');
    setRefreshToken(null); // No refresh token

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ message: 'Unauthorized' }),
    } as unknown as Response);

    await expect(apiClient('https://api.example.com/protected')).rejects.toThrow(
      'Session expired. Please log in again.'
    );
  });
});
