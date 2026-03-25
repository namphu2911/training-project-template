import { apiConfig, authConfig } from '../config/auth.config';
import { getAccessToken, clearAccessTokenCache } from './_auth.service';

const apiLog = (...args: unknown[]) => {
    if (!authConfig.enableDebugLogging) return;
    console.log('[API]', ...args);
};

// Helper: fetch with retry on 401 (token expired)
const fetchWithAuthRetry = async <T>(fetchFn: () => Promise<Response>, retryOnce = true): Promise<T> => {
    let response = await fetchFn();
    if (response.status === 401 && retryOnce) {
        apiLog('fetchWithAuthRetry:401-detected, clearing token and retrying');
        clearAccessTokenCache();
        response = await fetchFn(); // fetchFn will use latest token
    }
    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API request failed (${response.status}): ${err}`);
    }
    // Try to parse JSON, fallback to void
    try {
        return (await response.json()) as T;
    } catch {
        return undefined as unknown as T;
    }
};

const normalizeUrl = (baseUrl: string, path: string) => {
    const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
};

export const apiGet = async <T>(path: string): Promise<T> => {
    apiLog('apiGet:start', {
        baseUrl: apiConfig.baseUrl,
        path,
        scopes: apiConfig.scopes,
    });

    const fetchFn = async () => {
        const tokenResult = await getAccessToken();
        return fetch(normalizeUrl(apiConfig.baseUrl, path), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${tokenResult.accessToken}`,
                Accept: 'application/json',
            },
        });
    };
    return fetchWithAuthRetry<T>(fetchFn);
};

export const apiPost = async <T>(path: string, body: unknown): Promise<T> => {
    apiLog('apiPost:start', { path });

    const fetchFn = async () => {
        const tokenResult = await getAccessToken();
        return fetch(normalizeUrl(apiConfig.baseUrl, path), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${tokenResult.accessToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(body),
        });
    };
    return fetchWithAuthRetry<T>(fetchFn);
};

export const apiPut = async <T>(path: string, body: unknown): Promise<T> => {
    apiLog('apiPut:start', { path });
    const fetchFn = async () => {
        const tokenResult = await getAccessToken();
        return fetch(normalizeUrl(apiConfig.baseUrl, path), {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${tokenResult.accessToken}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(body),
        });
    };
    return fetchWithAuthRetry<T>(fetchFn);
};

export const apiDelete = async (path: string): Promise<void> => {
    apiLog('apiDelete:start', { path });
    const fetchFn = async () => {
        const tokenResult = await getAccessToken();
        return fetch(normalizeUrl(apiConfig.baseUrl, path), {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${tokenResult.accessToken}`,
            },
        });
    };
    await fetchWithAuthRetry<void>(fetchFn);
};

// For multipart file uploads – do NOT set Content-Type manually (browser sets it with boundary)
export const apiPostForm = async <T>(path: string, formData: FormData): Promise<T> => {
    apiLog('apiPostForm:start', { path });
    const fetchFn = async () => {
        const tokenResult = await getAccessToken();
        return fetch(normalizeUrl(apiConfig.baseUrl, path), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${tokenResult.accessToken}`,
                Accept: 'application/json',
            },
            body: formData,
        });
    };
    return fetchWithAuthRetry<T>(fetchFn);
};
