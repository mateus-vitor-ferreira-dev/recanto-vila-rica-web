import api from "./api";

export async function listMyGrants() {
    const { data } = await api.get("/promotions/my-grants");
    return data.data;
}
