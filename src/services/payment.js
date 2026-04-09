import api from "./api";

export async function createCheckoutSession(reservationId) {
    const { data } = await api.post(`/payments/checkout/${reservationId}`);
    return data.data;
}
