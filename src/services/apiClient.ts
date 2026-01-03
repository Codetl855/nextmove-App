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

export const setLogoutListener = (listener: () => void) => {
    logoutListener = listener;
};

export const handleTokenExpiration = async () => {
    try {
        await AsyncStorage.removeItem('loginUser');
        if (logoutListener) logoutListener();
    } catch (err) {
        console.error('Error clearing token', err);
    }
};

export const saveLoginToken = async (token: string, userData?: any) => {
    try {
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

export const NO_TOKEN_REQUIRED: string[] = [
    'login',
    'register',
    'forgot-password',
];

// Helper to check if an endpoint requires token
const requiresToken = (url?: string) => {
    if (!url) return true;
    return !NO_TOKEN_REQUIRED.some((endpoint) => url.includes(endpoint));
};

const api = axios.create({
    baseURL: BASE_URL,
    // timeout: 15000,
});

api.interceptors.request.use(
    async (config) => {
        if (requiresToken(config.url)) {
            const userData = await AsyncStorage.getItem('loginUser');
            if (userData) {
                const parsed = JSON.parse(userData);
                const token = parsed?.token;
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
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
    console.log('API Request:', endpoint);

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

        // Corrected: look inside error.response.data
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
