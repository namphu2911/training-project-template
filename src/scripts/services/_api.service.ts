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
