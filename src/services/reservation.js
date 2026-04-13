import api from "./api";

export async function quoteReservation(payload, signal) {
    const { data } = await api.post("/reservations/quote", payload, { signal });
    return data.data;
}

export async function createReservation(payload) {
    const { data } = await api.post("/reservations", payload);
    return data.data;
}

export async function listReservations(signal) {
    const { data } = await api.get("/reservations", { signal });
    return data.data || [];
}

export async function getReservation(reservationId, signal) {
    const { data } = await api.get(`/reservations/${reservationId}`, { signal });
    return data.data;
}

export async function cancelReservation(reservationId) {
    const { data } = await api.patch(`/reservations/${reservationId}/cancel`);
    return data.data;
}
