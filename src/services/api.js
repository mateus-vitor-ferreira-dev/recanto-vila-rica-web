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

export default api;