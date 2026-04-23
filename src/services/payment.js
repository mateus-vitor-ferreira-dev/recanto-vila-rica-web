/**
 * @module services/payment
 * @description Funções para iniciar e consultar pagamentos.
 *
 * Métodos suportados:
 * - **Stripe** (cartão de crédito) — redireciona para checkout.stripe.com
 * - **PIX** (Mercado Pago) — retorna QR Code + copia-e-cola para exibição inline
 */
import api from "./api";

/**
 * Cria uma sessão de checkout no Stripe para pagamento via cartão.
 * Retorna a URL de redirecionamento para o checkout hospedado pelo Stripe.
 *
 * @see POST /payments/checkout/:reservationId
 * @param {string} reservationId
 * @returns {Promise<{ url: string }>} URL do checkout Stripe
 */
export async function createCheckoutSession(reservationId) {
    const { data } = await api.post(`/payments/checkout/${reservationId}`);
    return data;
}

/**
 * Gera uma cobrança PIX via Mercado Pago para a reserva.
 * Retorna os dados necessários para exibir o QR Code ao usuário.
 *
 * @see POST /payments/pix/:reservationId
 * @param {string} reservationId
 * @returns {Promise<{ txid: string, qrCode: string, copyPaste: string, expiresAt: string }>}
 */
export async function createPixCharge(reservationId) {
    const { data } = await api.post(`/payments/pix/${reservationId}`);
    return data.data;
}

/**
 * Consulta o status atual do pagamento de uma reserva.
 * Usado pelo polling no Checkout para detectar quando o PIX é pago.
 *
 * @see GET /payments/reservation/:reservationId
 * @param {string} reservationId
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ payment: { status: string }, reservationStatus: string }>}
 */
export async function getPaymentStatus(reservationId, signal) {
    const { data } = await api.get(`/payments/reservation/${reservationId}`, { signal });
    return data.data;
}
