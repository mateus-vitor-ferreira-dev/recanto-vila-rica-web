import api from "./api";

export async function quoteReservation(payload) {
    const { data } = await api.post("/reservations/quote", payload);
    return data.data;
}

export async function createReservation(payload) {
    const { data } = await api.post("/reservations", payload);
    return data.data;
}

export async function listReservations() {
    const { data } = await api.get("/reservations");
    return data.data || [];
}

export async function getReservation(reservationId) {
    const { data } = await api.get(`/reservations/${reservationId}`);
    return data.data;
}

export async function cancelReservation(reservationId) {
    const { data } = await api.patch(`/reservations/${reservationId}/cancel`);
    return data.data;
}
