/**
 * @module services/negotiation
 * @description Funções para o fluxo de negociação de condições especiais de reserva.
 *
 * Fluxo:
 *   1. Usuário cria negociação (`createNegotiation`)
 *   2. Troca de mensagens entre usuário e admin (`sendMessage`)
 *   3. Admin envia proposta com preço e datas customizadas (`sendProposal`)
 *   4. Usuário aceita ou recusa (`respondToProposal`)
 *   5. Se aceita, a reserva é criada automaticamente pelo backend
 *
 * Alternativa (admin): admin cria reserva customizada diretamente (`createCustomReservation`).
 */
import api from "./api";

/**
 * Abre uma nova negociação para o usuário autenticado.
 *
 * @see POST /negotiations
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ id: string, status: "OPEN" }>}
 */
export async function createNegotiation(signal) {
    const response = await api.post("/negotiations", {}, { signal });
    return response.data.data;
}

/**
 * Lista todas as negociações do usuário autenticado.
 * Admins recebem todas as negociações do sistema.
 *
 * @see GET /negotiations
 * @param {AbortSignal} [signal]
 * @returns {Promise<Array<{ id: string, status: string, subject: string, user: object, messages: Array }>>}
 */
export async function listNegotiations(signal) {
    const response = await api.get("/negotiations", { signal });
    return response.data.data;
}

/**
 * Busca os detalhes de uma negociação incluindo todas as mensagens.
 *
 * @see GET /negotiations/:id
 * @param {string} id
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ id: string, status: string, messages: Array<{ id: string, content: string, authorId: string, createdAt: string }>, pendingProposal: object | null }>}
 */
export async function getNegotiation(id, signal) {
    const response = await api.get(`/negotiations/${id}`, { signal });
    return response.data.data;
}

/**
 * Envia uma mensagem de texto na negociação.
 *
 * @see POST /negotiations/:id/messages
 * @param {string} id - ID da negociação
 * @param {string} content - Texto da mensagem
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ id: string, content: string, authorId: string, createdAt: string }>}
 */
export async function sendMessage(id, content, signal) {
    const response = await api.post(`/negotiations/${id}/messages`, { content }, { signal });
    return response.data.data;
}

/**
 * Atualiza o status da negociação (ex.: CLOSED, REJECTED).
 * Ação tipicamente realizada pelo admin.
 *
 * @see PATCH /negotiations/:id/status
 * @param {string} id
 * @param {"CLOSED" | "REJECTED"} status
 * @returns {Promise<{ id: string, status: string }>}
 */
export async function updateNegotiationStatus(id, status) {
    const response = await api.patch(`/negotiations/${id}/status`, { status });
    return response.data.data;
}

/**
 * Admin cria uma reserva customizada diretamente a partir de uma negociação,
 * sem passar pelo fluxo de proposta/aceitação.
 *
 * @see POST /negotiations/:id/reservation
 * @param {string} id - ID da negociação
 * @param {{ venueId: string, startDate: string, endDate: string, customPriceCents: number, notes?: string }} payload
 * @returns {Promise<{ reservation: object, pix: object }>}
 */
export async function createCustomReservation(id, payload) {
    const response = await api.post(`/negotiations/${id}/reservation`, payload);
    return response.data.data;
}

/**
 * Admin envia uma proposta formal com preço e datas customizadas.
 * A proposta fica pendente até o usuário responder via `respondToProposal`.
 *
 * @see POST /negotiations/:id/proposal
 * @param {string} id - ID da negociação
 * @param {{ venueId: string, startDate: string, endDate: string, customPriceCents: number, notes?: string }} payload
 * @returns {Promise<{ id: string, pendingProposal: object }>}
 */
export async function sendProposal(id, payload) {
    const response = await api.post(`/negotiations/${id}/proposal`, payload);
    return response.data.data;
}

/**
 * Usuário aceita ou recusa a proposta pendente na negociação.
 * Se aceita, a reserva é criada automaticamente pelo backend.
 *
 * @see POST /negotiations/:id/proposal/respond
 * @param {string} id - ID da negociação
 * @param {"ACCEPT" | "REJECT"} action
 * @returns {Promise<{ action: string, reservation?: object, pix?: object }>}
 */
export async function respondToProposal(id, action) {
    const response = await api.post(`/negotiations/${id}/proposal/respond`, { action });
    return response.data.data;
}

/**
 * Retorna as informações de contato públicas do Recanto Vila Rica
 * (WhatsApp, e-mail, Instagram).
 *
 * @see GET /contact
 * @param {AbortSignal} [signal]
 * @returns {Promise<{ whatsapp: { number: string, display: string }, email: string, instagram: { url: string, display: string } }>}
 */
export async function getContactInfo(signal) {
    const response = await api.get("/contact", { signal });
    return response.data.data;
}
