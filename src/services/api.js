import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
    const userData = JSON.parse(localStorage.getItem("recanto:userData") || "{}");
    const token = userData?.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

const MAX_RETRIES = 3;

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config;
        const status = error.response?.status;

        if (status === 429) {
            return Promise.reject(error);
        }

        const isAuthEndpoint = config.url?.startsWith("/auth/");
        const isGetRequest = config.method?.toLowerCase() === "get";

        if (!isAuthEndpoint && isGetRequest && status >= 500) {
            config._retryCount = (config._retryCount || 0) + 1;

            if (config._retryCount <= MAX_RETRIES) {
                const delay = 1000 * config._retryCount;
                await new Promise((resolve) => setTimeout(resolve, delay));
                return api(config);
            }
        }

        return Promise.reject(error);
    }
);

export default api;