import { apiConfig, authConfig } from '../config/auth.config';
import { ApiDownloadResult } from '../models/_interfaces';
import { getAccessToken, clearAccessTokenCache } from './_auth.service';

const apiLog = (...args: unknown[]) => {
    if (!authConfig.enableDebugLogging) return;
    console.log('[API]', ...args);
};

// Helper: fetch with retry on 401 (token expired)
const fetchResponseWithAuthRetry = async (fetchFn: () => Promise<Response>, retryOnce = true): Promise<Response> => {
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
    return response;
};

const fetchWithAuthRetry = async <T>(fetchFn: () => Promise<Response>, retryOnce = true): Promise<T> => {
    const response = await fetchResponseWithAuthRetry(fetchFn, retryOnce);

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

const parseFileNameFromContentDisposition = (headerValue: string | null): string | null => {
    if (!headerValue) return null;

    const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(headerValue);
    if (utf8Match?.[1]) {
        try {
            return decodeURIComponent(utf8Match[1]);
        } catch {
            return utf8Match[1];
        }
    }

    const quotedMatch = /filename="([^"]+)"/i.exec(headerValue);
    if (quotedMatch?.[1]) return quotedMatch[1];

    const plainMatch = /filename=([^;]+)/i.exec(headerValue);
    if (plainMatch?.[1]) return plainMatch[1].trim();

    return null;
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

export const apiDownload = async (path: string): Promise<ApiDownloadResult> => {
    apiLog('apiDownload:start', { path });

    const fetchFn = async () => {
        const tokenResult = await getAccessToken();
        return fetch(normalizeUrl(apiConfig.baseUrl, path), {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${tokenResult.accessToken}`,
            },
        });
    };

    const response = await fetchResponseWithAuthRetry(fetchFn);
    const blob = await response.blob();
    const fileName = parseFileNameFromContentDisposition(response.headers.get('Content-Disposition'));

    return { blob, fileName };
};
