/**
 * @module services/availability
 * @description Funções para consultar a disponibilidade de um espaço.
 * Usadas pelo `AvailabilityCalendar` para colorir datas no calendário.
 *
 * - **Datas bloqueadas**: períodos manualmente bloqueados pelo admin (manutenção, etc.)
 * - **Datas ocupadas**: períodos com reservas PENDING ou PAID
 */
import api from "./api";

/**
 * Retorna os períodos manualmente bloqueados para um espaço.
 *
 * @see GET /blocked-dates?venueId=
 * @param {string} venueId
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{ startDate: string, endDate: string, reason: string | null }>>}
 */
export async function getBlockedDates(venueId, signal) {
    const { data } = await api.get("/blocked-dates", { params: { venueId }, signal });
    return data.data || [];
}

/**
 * Retorna os períodos com reservas ativas (PENDING ou PAID) para um espaço.
 * Endpoint público — não requer autenticação.
 *
 * @see GET /reservations/occupied-dates?venueId=
 * @param {string} venueId
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{ startDate: string, endDate: string }>>}
 */
export async function getOccupiedDates(venueId, signal) {
    const { data } = await api.get("/reservations/occupied-dates", { params: { venueId }, signal });
    return data.data || [];
}
