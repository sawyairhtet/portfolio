import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '',
    timeout: 10_000,
    headers: { Accept: 'application/json' },
});

// Request interceptor: attach Authorization header for same-origin requests only.
// Cross-origin POSTs (e.g., to Formspree) must not carry our bearer token.
api.interceptors.request.use(
    config => {
        const token = localStorage.getItem('auth_token');
        if (!token || !config.headers) return config;

        const requestUrl = config.url ?? '';
        const isAbsolute = /^https?:\/\//i.test(requestUrl);
        if (isAbsolute) {
            try {
                if (new URL(requestUrl).origin !== window.location.origin) {
                    return config;
                }
            } catch {
                return config;
            }
        }

        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    error => Promise.reject(error)
);

// Response interceptor: centralised error handling.
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
        }
        return Promise.reject(error);
    }
);

export default api;
