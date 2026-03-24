export const authConfig = {
    tenantId: 'd09600d6-acac-480e-84d9-7b68daf22e3c',
    clientId: 'b9fff41a-f5dd-4d68-b230-95e45b37ab25',
    redirectUri: window.location.origin,
    enableDebugLogging: true,
};

export const apiConfig = {
    baseUrl: 'https://localhost:7041',
    scopes: ['api://b9fff41a-f5dd-4d68-b230-95e45b37ab25/access_as_user'],
    testEndpoint: '/api/documents/me',
};
