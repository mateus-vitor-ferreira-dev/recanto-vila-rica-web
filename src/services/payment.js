import api from "./api";

export async function createCheckoutSession(reservationId) {
    const { data } = await api.post(`/payments/checkout/${reservationId}`);
    return data;
}

export async function createPixCharge(reservationId) {
    const { data } = await api.post(`/payments/pix/${reservationId}`);
    return data.data;
}

export async function getPaymentStatus(reservationId, signal) {
    const { data } = await api.get(`/payments/reservation/${reservationId}`, { signal });
    return data.data;
}
