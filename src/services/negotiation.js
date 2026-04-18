import api from "./api";

export async function createNegotiation(signal) {
    const response = await api.post("/negotiations", {}, { signal });
    return response.data.data;
}

export async function listNegotiations(signal) {
    const response = await api.get("/negotiations", { signal });
    return response.data.data;
}

export async function getNegotiation(id, signal) {
    const response = await api.get(`/negotiations/${id}`, { signal });
    return response.data.data;
}

export async function sendMessage(id, content, signal) {
    const response = await api.post(`/negotiations/${id}/messages`, { content }, { signal });
    return response.data.data;
}

export async function updateNegotiationStatus(id, status) {
    const response = await api.patch(`/negotiations/${id}/status`, { status });
    return response.data.data;
}

export async function createCustomReservation(id, payload) {
    const response = await api.post(`/negotiations/${id}/reservation`, payload);
    return response.data.data;
}

export async function sendProposal(id, payload) {
    const response = await api.post(`/negotiations/${id}/proposal`, payload);
    return response.data.data;
}

export async function respondToProposal(id, action) {
    const response = await api.post(`/negotiations/${id}/proposal/respond`, { action });
    return response.data.data;
}

export async function getContactInfo(signal) {
    const response = await api.get("/contact", { signal });
    return response.data.data;
}
