import { apiConfig, authConfig } from '../config/auth.config';
import { getAccessToken } from './_auth.service';

const apiLog = (...args: unknown[]) => {
    if (!authConfig.enableDebugLogging) return;
    console.log('[API]', ...args);
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

    const accessToken = await getAccessToken();
    apiLog('apiGet:token-ready', {
        tokenPreview: `${accessToken.slice(0, 12)}...${accessToken.slice(-8)}`,
        // tokenPreview: accessToken,
        tokenLength: accessToken.length,
    });

    const response = await fetch(normalizeUrl(apiConfig.baseUrl, path), {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
        },
    });

    apiLog('apiGet:response', {
        status: response.status,
        ok: response.ok,
        url: response.url,
    });

    if (!response.ok) {
        const body = await response.text();
        apiLog('apiGet:error-body', body);
        throw new Error(`API request failed (${response.status}): ${body}`);
    }

    const json = await response.json() as T;
    apiLog('apiGet:success');
    return json;
};

export const apiPost = async <T>(path: string, body: unknown): Promise<T> => {
    apiLog('apiPost:start', { path });
    const accessToken = await getAccessToken();

    const response = await fetch(normalizeUrl(apiConfig.baseUrl, path), {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(body),
    });

    apiLog('apiPost:response', { status: response.status, ok: response.ok });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API POST failed (${response.status}): ${err}`);
    }

    return response.json() as Promise<T>;
};

export const apiPut = async <T>(path: string, body: unknown): Promise<T> => {
    apiLog('apiPut:start', { path });
    const accessToken = await getAccessToken();

    const response = await fetch(normalizeUrl(apiConfig.baseUrl, path), {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(body),
    });

    apiLog('apiPut:response', { status: response.status, ok: response.ok });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API PUT failed (${response.status}): ${err}`);
    }

    return response.json() as Promise<T>;
};

export const apiDelete = async (path: string): Promise<void> => {
    apiLog('apiDelete:start', { path });
    const accessToken = await getAccessToken();

    const response = await fetch(normalizeUrl(apiConfig.baseUrl, path), {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    apiLog('apiDelete:response', { status: response.status, ok: response.ok });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API DELETE failed (${response.status}): ${err}`);
    }
};

// For multipart file uploads – do NOT set Content-Type manually (browser sets it with boundary)
export const apiPostForm = async <T>(path: string, formData: FormData): Promise<T> => {
    apiLog('apiPostForm:start', { path });
    const accessToken = await getAccessToken();

    const response = await fetch(normalizeUrl(apiConfig.baseUrl, path), {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
        },
        body: formData,
    });

    apiLog('apiPostForm:response', { status: response.status, ok: response.ok });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`API POST form failed (${response.status}): ${err}`);
    }

    return response.json() as Promise<T>;
};
