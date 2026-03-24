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

export const getAccessToken = async (): Promise<string> => {
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

        return token.accessToken;
    } catch (error) {
        authLog('acquireTokenSilent:failed', error);

        if (error instanceof InteractionRequiredAuthError) {
            return acquireTokenInteractive();
        }
        throw error;
    }
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
