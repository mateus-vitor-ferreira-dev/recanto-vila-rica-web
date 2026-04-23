/**
 * @module api
 * @description Instância Axios configurada para o backend do Recanto Vila Rica.
 *
 * Comportamentos automáticos:
 * - **Auth**: injeta o Bearer token de `localStorage["recanto:userData"]` em toda requisição.
 * - **Retry**: requisições GET que falham com 5xx são reenviadas até 3×
 *   com backoff linear (1 s, 2 s, 3 s). Não reenvía em ambiente de teste,
 *   em endpoints `/auth/*`, nem em erros 429.
 * - **Rate limit (429)**: rejeitado imediatamente sem retry para que o
 *   componente exiba o toast de "muitas requisições" ao usuário.
 */
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
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
const isTestEnv =
    import.meta.env.MODE === "test" ||
    Boolean(import.meta.env.VITEST);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config ?? {};
        const status = error.response?.status;

        if (status === 429) {
            return Promise.reject(error);
        }

        const isAuthEndpoint = config.url?.startsWith("/auth/");
        const isGetRequest = config.method?.toLowerCase() === "get";
        const isAbortError =
            error?.name === "CanceledError" || error?.name === "AbortError";

        if (
            !isTestEnv &&
            !isAbortError &&
            !isAuthEndpoint &&
            isGetRequest &&
            status >= 500
        ) {
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
