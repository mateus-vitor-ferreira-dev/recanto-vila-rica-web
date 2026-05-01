/**
 * @module services/reservation
 * @description Funções de acesso à API de reservas.
 *
 * Fluxo principal:
 *   1. `quoteReservation` — calcula preço antes de confirmar
 *   2. `createReservation` — cria a reserva (status PENDING)
 *   3. Usuário paga via Checkout (Stripe ou PIX)
 *   4. `cancelReservation` — cancelamento com reembolso proporcional
 */
import api from "./api";

/**
 * Calcula o preço estimado de uma reserva sem criá-la.
 *
 * @see POST /reservations/quote
 * @param {{ venueId: string, planCode: string, startDate: string, endDate: string, kidsMonitorExtraHours?: number }} payload
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ totalPrice: number, planCode: string, breakdown: object }>}
 */
export async function quoteReservation(payload, signal) {
    const { data } = await api.post("/reservations/quote", payload, { signal });
    return data.data;
}

/**
 * Cria uma nova reserva com status PENDING.
 * O campo `termsAccepted: true` é obrigatório pela API.
 *
 * @see POST /reservations
 * @param {{ venueId: string, planCode: string, startDate: string, endDate: string, termsAccepted: true, notes?: string, kidsMonitorExtraHours?: number }} payload
 * @returns {Promise<{ id: string, status: "PENDING", totalPrice: number }>}
 */
export async function createReservation(payload) {
    const { data } = await api.post("/reservations", payload);
    return data.data;
}

/**
 * Lista todas as reservas do usuário autenticado.
 *
 * @see GET /reservations
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{ id: string, status: string, startDate: string, endDate: string, totalPrice: number, venue: object, payment: object }>>}
 */
export async function listReservations(signal) {
    const { data } = await api.get("/reservations", { signal });
    return data.data || [];
}

/**
 * Lista as reservas do usuário com suporte a paginação.
 *
 * @see GET /reservations
 * @param {AbortSignal} [signal]
 * @param {{ page?: number, limit?: number }} [params]
 * @returns {Promise<{ data: Array, meta: { page: number, limit: number, total: number, totalPages: number } }>}
 */
export async function listReservationsPaginated(signal, { page = 1, limit = 10 } = {}) {
    const { data } = await api.get("/reservations", { signal, params: { page, limit } });
    return { data: data.data || [], meta: data.meta };
}

/**
 * Busca os detalhes completos de uma reserva específica.
 *
 * @see GET /reservations/:id
 * @param {string} reservationId
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ id: string, status: string, startDate: string, endDate: string, totalPrice: number, venue: object, payment: object }>}
 */
export async function getReservation(reservationId, signal) {
    const { data } = await api.get(`/reservations/${reservationId}`, { signal });
    return data.data;
}

/**
 * Cancela uma reserva PENDING ou PAID.
 * Para reservas pagas, o backend processa o reembolso proporcional automaticamente
 * conforme a política de cancelamento (100% / 70% / 40% / 0%).
 *
 * @see PATCH /reservations/:id/cancel
 * @param {string} reservationId
 * @returns {Promise<{ id: string, status: "CANCELLED", refundInfo?: { percentage: number, refundAmount: number } }>}
 */
export async function cancelReservation(reservationId) {
    const { data } = await api.patch(`/reservations/${reservationId}/cancel`);
    return data.data;
}
