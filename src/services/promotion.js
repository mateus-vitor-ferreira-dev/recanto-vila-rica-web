/**
 * @module services/promotion
 * @description Funções para consultar promoções e descontos do usuário autenticado.
 */
import api from "./api";

/**
 * Lista os grants de desconto disponíveis para o usuário autenticado.
 * Grants são gerados automaticamente pelo sistema de campanhas
 * (referral qualificado, fidelidade, sorteio VIP).
 *
 * @see GET /promotions/my-grants
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{ id: string, discountType: string, discountValue: number, used: boolean, expiresAt: string | null, campaign: object }>>}
 */
export async function listMyGrants(signal) {
    const { data } = await api.get("/promotions/my-grants", { signal });
    return data.data;
}

/**
 * Lista campanhas promocionais ativas no momento.
 *
 * @see GET /promotions/active
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{ id: string, code: string, type: string, name: string, startsAt: string, endsAt: string, config: object|null }>>}
 */
export async function listActivePromotions(signal) {
    const { data } = await api.get("/promotions/active", { signal });
    return data.data ?? [];
}

/**
 * Retorna o status de cada tipo de campanha (ativa, agendada, encerrada, não configurada).
 *
 * @see GET /promotions/status
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{ type: string, status: "active"|"scheduled"|"ended"|"disabled"|"not_configured", campaign: object|null }>>}
 */
export async function listPromotionStatus(signal) {
    const { data } = await api.get("/promotions/status", { signal });
    return data.data ?? [];
}
