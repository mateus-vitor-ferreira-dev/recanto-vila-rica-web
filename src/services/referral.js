/**
 * @module services/referral
 * @description Funções para o programa de indicações.
 * Usuários indicam amigos por e-mail; quando o indicado faz a primeira reserva,
 * o indicador ganha desconto conforme a campanha ativa do tipo REFERRAL_NEXT_BOOKING.
 */
import api from "./api";

/**
 * Cria uma indicação para o e-mail informado.
 * Requer uma campanha de indicação ativa — caso contrário, a API retorna
 * `NO_ACTIVE_REFERRAL_CAMPAIGN`.
 *
 * @see POST /referrals
 * @param {string} referredEmail - E-mail do amigo a ser indicado
 * @returns {Promise<{ id: string, referredEmail: string, status: "PENDING", campaign: object }>}
 */
export async function createReferral(referredEmail) {
    const { data } = await api.post("/referrals", { referredEmail });
    return data.data;
}

/**
 * Lista todas as indicações feitas pelo usuário autenticado.
 *
 * @see GET /referrals
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{ id: string, referredEmail: string, status: "PENDING" | "QUALIFIED" | "REWARDED" | "EXPIRED" | "CANCELLED", campaign: object, createdAt: string }>>}
 */
export async function listReferrals(signal) {
    const { data } = await api.get("/referrals", { signal });
    return data.data;
}
