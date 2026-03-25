import {
    PublicClientApplication,
    AccountInfo,
    InteractionRequiredAuthError,
} from '@azure/msal-browser';
import { authConfig, apiConfig } from '../config/auth.config';

const authority = `https://login.microsoftonline.com/${authConfig.tenantId}`;

const authLog = (...args: unknown[]) => {
    if (!authConfig.enableDebugLogging) return;
    console.log('[Auth]', ...args);
};

const toIsoString = (value: Date | null | undefined) => {
    if (!value) return null;
    return value.toISOString();
};

const getLogoutHint = (account: AccountInfo | null): string | undefined => {
    if (!account?.idTokenClaims) return undefined;
    const claims = account.idTokenClaims as Record<string, unknown>;
    const hint = claims.login_hint;
    return typeof hint === 'string' ? hint : undefined;
};

const msalInstance = new PublicClientApplication({
    auth: {
        clientId: authConfig.clientId,
        authority,
        redirectUri: authConfig.redirectUri,
    },
    cache: {
        cacheLocation: 'localStorage',
    },
});

const setActiveAccountIfMissing = () => {
    if (msalInstance.getActiveAccount()) return;
    const account = msalInstance.getAllAccounts()[0];
    if (account) {
        msalInstance.setActiveAccount(account);
        authLog('setActiveAccountIfMissing', {
            username: account.username,
            name: account.name,
            homeAccountId: account.homeAccountId,
        });
    }
};

export const initializeAuth = async () => {
    authLog('initializeAuth:start', {
        authority,
        clientId: authConfig.clientId,
        redirectUri: authConfig.redirectUri,
        apiScopes: apiConfig.scopes,
    });

    await msalInstance.initialize();
    const redirectResult = await msalInstance.handleRedirectPromise();

    if (redirectResult?.account) {
        msalInstance.setActiveAccount(redirectResult.account);

        // Detailed login response tracing (redacted token value)
        authLog('login:response', redirectResult);
    } else {
        authLog('login:response', null);
        setActiveAccountIfMissing();
    }

    const activeAccount = msalInstance.getActiveAccount();
    authLog('initializeAuth:done', {
        activeUser: activeAccount?.username || null,
        accountCount: msalInstance.getAllAccounts().length,
    });
};

export const login = async (): Promise<void> => {
    authLog('login:start');

    if (!authConfig.clientId) {
        throw new Error('Please set authConfig.clientId in src/scripts/config/auth.config.ts');
    }

    authLog('login:redirect-start', {
        scopes: ['openid', 'profile', 'offline_access', ...apiConfig.scopes],
    });

    await msalInstance.loginRedirect({
        scopes: ['openid', 'profile', 'offline_access', ...apiConfig.scopes],
        prompt: 'select_account',
        redirectUri: authConfig.redirectUri,
    });
};

export const logout = async () => {
    authLog('logout:start');

    // Clear token cache on logout
    clearAccessTokenCache();

    const account = msalInstance.getActiveAccount();
    const logoutHint = getLogoutHint(account);

    await msalInstance.logoutRedirect({
        account,
        logoutHint,
        postLogoutRedirectUri: authConfig.redirectUri,
    });

    authLog('logout:done', {
        postLogoutRedirectUri: authConfig.redirectUri,
        usedLogoutHint: !!logoutHint,
    });
};

const acquireTokenInteractive = async (): Promise<never> => {
    authLog('acquireTokenInteractive:start', { scopes: apiConfig.scopes });

    await msalInstance.acquireTokenRedirect({
        scopes: apiConfig.scopes,
        redirectUri: authConfig.redirectUri,
    });

    throw new Error('Redirecting to Microsoft Entra ID for token acquisition.');
};


// Cache for accessToken, its expiry, và fromCache
let cachedAccessToken: string | null = null;
let cachedExpiresOn: Date | null = null;
let cachedFromCache: boolean = false;

// Trả về object chứa accessToken và fromCache để debug
export interface AccessTokenResult {
    accessToken: string;
    fromCache: boolean;
}

export const getAccessToken = async (): Promise<AccessTokenResult> => {
    setActiveAccountIfMissing();
    authLog('getAccessToken:start');

    const account = msalInstance.getActiveAccount();
    if (!account) {
        authLog('getAccessToken:no-active-account => login');
        await login();
        throw new Error('Redirecting to Microsoft Entra ID for sign-in.');
    }

    const activeAccount = msalInstance.getActiveAccount();
    if (!activeAccount) {
        throw new Error('Unable to determine signed-in account.');
    }

    // Check if cached token is valid
    if (cachedAccessToken && cachedExpiresOn) {
        const now = new Date();
        // Add a buffer of 1 minute to avoid edge expiry
        if (cachedExpiresOn.getTime() - now.getTime() > 60 * 1000) {
            authLog('getAccessToken:using-cached-token', {
                expiresOn: toIsoString(cachedExpiresOn),
                fromCache: cachedFromCache,
            });
            return { accessToken: cachedAccessToken, fromCache: cachedFromCache };
        }
    }

    try {
        const token = await msalInstance.acquireTokenSilent({
            account: activeAccount,
            scopes: apiConfig.scopes,
        });

        authLog('acquireTokenSilent:success', {
            scopes: token.scopes,
            expiresOn: toIsoString(token.expiresOn),
            tenantId: token.tenantId,
            fromCache: token.fromCache,
            account: {
                username: token.account?.username,
                name: token.account?.name,
            },
        });

        cachedAccessToken = token.accessToken;
        cachedExpiresOn = token.expiresOn ? new Date(token.expiresOn) : null;
        cachedFromCache = !!token.fromCache;

        return { accessToken: token.accessToken, fromCache: !!token.fromCache };
    } catch (error) {
        authLog('acquireTokenSilent:failed', error);

        if (error instanceof InteractionRequiredAuthError) {
            // Clear cache on interactive error
            cachedAccessToken = null;
            cachedExpiresOn = null;
            cachedFromCache = false;
            await acquireTokenInteractive();
            throw new Error('Redirecting to Microsoft Entra ID for token acquisition.');
        }
        throw error;
    }
};

// Optional: clear token cache on logout
export const clearAccessTokenCache = () => {
    cachedAccessToken = null;
    cachedExpiresOn = null;
    cachedFromCache = false;
};

export const getCurrentUser = (): AccountInfo | null => {
    setActiveAccountIfMissing();
    const account = msalInstance.getActiveAccount();
    authLog('getCurrentUser', {
        username: account?.username || null,
        name: account?.name || null,
    });
    return account;
};
