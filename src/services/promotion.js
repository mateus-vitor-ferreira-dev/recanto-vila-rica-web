import api from "./api";

export async function listMyGrants(signal) {
    const { data } = await api.get("/promotions/my-grants", { signal });
    return data.data;
}
