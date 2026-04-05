export const BASE_API_SERVICES = 'http://192.168.100.15:3201';
export const BASE_API_LOGIN = 'http://192.168.100.15:3201';
export const environment = {
    appName: 'Revolutie',
    production: false,
    ALGORITHM: 'AES-GCM',
    KEY_LENGTH: 256,
    IV_LENGTH: 12,
    SALT_LENGTH: 16,
    ITERATIONS: 100_000,
    HASH: 'SHA-256',
    PASSPHRASE: 'CAMBIA_ESTO_EN_PRODUCCION',
    LOGO_URL: `${BASE_API_SERVICES}/public-images/logo.jpg`,
    ICON_APP_URL: `${BASE_API_SERVICES}/public-images/icon-app.svg`,
    TEST_USER_PHOTO_URL: `${BASE_API_SERVICES}/public-images/invincible.jpg`,
    SESSION_KEY: 'key',
    TOKEN_KEY: 'tkn',
    LOGIN_URL: `${BASE_API_LOGIN}/auth/login`,
    SERVICES_COUNT_URL: `${BASE_API_SERVICES}/product/count`,
    CUSTOMERS_COUNT_URL: `${BASE_API_SERVICES}/customer/count`,
};