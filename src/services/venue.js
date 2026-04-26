/**
 * @module services/venue
 * @description Funções para listar e buscar espaços para eventos.
 */
import api from "./api";

/**
 * Lista todos os espaços disponíveis para reserva.
 *
 * @see GET /venues
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{ id: string, name: string, description: string, capacity: number, amenities: object }>>}
 */
export async function listVenues(signal) {
    const { data } = await api.get("/venues", { signal });
    return data.data || [];
}

/**
 * Busca os detalhes de um espaço específico.
 *
 * @see GET /venues/:id
 * @param {string} venueId
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ id: string, name: string, description: string, capacity: number, amenities: object }>}
 */
export async function getVenue(venueId, signal) {
    const { data } = await api.get(`/venues/${venueId}`, { signal });
    return data.data;
}

export async function updateVenue(venueId, payload) {
    const { data } = await api.patch(`/venues/${venueId}`, payload);
    return data.data;
}
