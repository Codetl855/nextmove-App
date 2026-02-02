import axios, { AxiosRequestConfig, Method } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://uat.nextmove.estate/backend/api/';
type ApiMethod = 'GET' | 'POST' | 'DELETE' | 'PUT';

interface ApiCallParams {
    endpoint: string;
    method?: ApiMethod;
    data?: any;
    config?: AxiosRequestConfig;
}

let logoutListener: (() => void) | null = null;

let authToken: string | null = null;
let tokenLoadTime: number = 0;
const TOKEN_CACHE_DURATION = 60000;

export const setLogoutListener = (listener: () => void) => {
    logoutListener = listener;
};

export const handleTokenExpiration = async () => {
    try {
        authToken = null;
        tokenLoadTime = 0;
        await AsyncStorage.removeItem('loginUser');
        if (logoutListener) logoutListener();
    } catch (err) {
        console.error('Error clearing token', err);
    }
};

export const saveLoginToken = async (token: string, userData?: any) => {
    try {
        authToken = token;
        tokenLoadTime = Date.now();
        await AsyncStorage.setItem(
            'loginUser',
            JSON.stringify({ token, ...userData })
        );
    } catch (err) {
        console.error('Failed to save login token', err);
    }
};

export const getLoginUser = async () => {
    try {
        const data = await AsyncStorage.getItem('loginUser');
        return data ? JSON.parse(data) : null;
    } catch (err) {
        console.error('Failed to get login user', err);
        return null;
    }
};

const getToken = async (forceRefresh: boolean = false): Promise<string | null> => {
    const now = Date.now();
    const cacheIsValid = authToken && (now - tokenLoadTime < TOKEN_CACHE_DURATION);

    if (cacheIsValid && !forceRefresh) {
        return authToken;
    }

    try {
        const userData = await AsyncStorage.getItem('loginUser');
        if (userData) {
            const parsed = JSON.parse(userData);
            authToken = parsed?.token || null;
            tokenLoadTime = now;
            return authToken;
        }
        authToken = null;
        return null;
    } catch (err) {
        console.error('Failed to get token', err);
        return authToken;
    }
};

export const initializeAuth = async () => {
    await getToken(true);
};

export const NO_TOKEN_REQUIRED: string[] = [
    'login',
    'register',
    'forgot-password',
    'verification-notification',
];

const requiresToken = (url?: string) => {
    if (!url) return true;
    return !NO_TOKEN_REQUIRED.some((endpoint) => url.includes(endpoint));
};

const api = axios.create({
    baseURL: BASE_URL,
});

api.interceptors.request.use(
    async (config) => {
        if (requiresToken(config.url)) {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const token = await getToken(true);

            if (token) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            }
        }

        return Promise.reject(error);
    }
);

export const apiRequest = async <T = any>({
    endpoint,
    method = 'POST',
    data = {},
    config = {},
}: ApiCallParams): Promise<{
    result?: T;
    error?: string;
    fieldErrors?: Record<string, string[]>;
    tokenExpired?: boolean;
}> => {
    try {
        const response = await api.request<T>({
            url: endpoint,
            method: method as Method,
            data: method === 'POST' || method === 'PUT' ? data : undefined,
            params: method === 'GET' ? data : undefined,
            ...config,
        });

        return { result: response.data };
    } catch (error: any) {
        if (error.response?.status === 401) {
            await handleTokenExpiration();
            return {
                error: `${error.response?.data?.message ||
                    error.response?.data?.detail ||
                    error.message ||
                    error.toString()}. Please log in again.`,
                tokenExpired: true,
            };
        }

        if (error.response?.data?.errors) {
            return {
                error: error.response.data.message || 'Validation errors occurred.',
                fieldErrors: error.response.data.errors,
            };
        }

        const fallback =
            error.response?.data?.message ||
            error.response?.data?.detail ||
            error.message ||
            error.toString() ||
            'Something went wrong. Please try again.';

        return { error: fallback };
    }
};