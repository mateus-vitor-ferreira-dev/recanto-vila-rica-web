import api from "./api";

export async function createReferral(referredEmail) {
    const { data } = await api.post("/referrals", { referredEmail });
    return data.data;
}

export async function listReferrals(signal) {
    const { data } = await api.get("/referrals", { signal });
    return data.data;
}
