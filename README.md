# Training project template user guide

## Prerequisite

- NodeJS: [Download here](https://nodejs.org/en/download/)
- Visual studio code: [Download here](https://code.visualstudio.com/)
- Git for windows 64-bit: [Download here](https://git-scm.com/download/win)

## Work with repository

- Create your own github account
- Fork this repository to your account repository
- Clone project repository from your account to local
- Open visual studio code or command prompt
- Navigate to local repository
- Run cmd "npm install" in vscode terminal or command prompt
- After npm install run successful, run cmd "npm start" to start compiling and bundling js and scss files.

## Azure AD (Microsoft Entra ID) integration

This project now supports Entra ID sign-in on the frontend and calling a protected .NET API with a bearer token.

### 1) Frontend app registration (SPA)

- Open Microsoft Entra admin center.
- Create an app registration for this frontend (Single-page application).
- Add Redirect URI: your frontend origin (example: `http://localhost:5500` or your local host URL).
- Save the `Application (client) ID` and `Directory (tenant) ID`.

### 2) API app registration (.NET)

- Create a second app registration for your .NET API.
- Expose an API and create a scope (example: `access_as_user`).
- Note your App ID URI and scope value, for example:
  - `api://<api-client-id>/access_as_user`

### 3) Update frontend auth config

Edit `src/scripts/config/auth.config.ts`:

- `authConfig.tenantId`: Entra tenant ID.
- `authConfig.clientId`: SPA client ID.
- `authConfig.redirectUri`: frontend URL.
- `apiConfig.baseUrl`: .NET API base URL.
- `apiConfig.scopes`: your exposed API scopes.
- `apiConfig.testEndpoint`: any protected endpoint in your API.

### 4) Configure .NET API authentication

In your .NET API:

- Add JWT bearer auth with Microsoft identity platform.
- Validate audience against your API App ID URI/client ID.
- Protect endpoint(s) with `[Authorize]`.
- Enable CORS for your frontend origin.

### 5) Runtime flow in this template

- Use `Sign in` in navbar to authenticate with Entra ID (MSAL redirect flow).
- `Sync` now calls `apiConfig.testEndpoint` with `Authorization: Bearer <token>`.
- `Sign out` clears the current authenticated session.
- `Sign out` uses `logoutRedirect` and returns to `authConfig.redirectUri`.

### 6) Debug auth flow and popup behavior

- Redirect flow performs full-page navigation to Microsoft Entra ID and then back to your app (`authConfig.redirectUri`).
- Open browser dev tools console on main app window.
- Filter logs by:
  - `[Auth]` for high-level auth flow steps.
  - `[MSAL]` for MSAL internal logs.
  - `[API]` for API call, token-ready, and response status logs.
- Toggle debug logs in `src/scripts/config/auth.config.ts` via `enableDebugLogging`.

### Notes

- File without prefix underscore "\_" are public files (Example: home-page.ts, home-page.scss). Webpack **only** transpile these files to js or css in "dist" folder.
- Files with prefix underscore "\_" are internal files. These files are imported in public file. Webpack is **not** transpile these files to js or css in "dist" folder.
- This project is using ESlint with Airbnb JavaScript Style Guide for checking consistent of coding convention. More info about Airbnb JavaScript Style Guide [here](https://github.com/airbnb/javascript)
