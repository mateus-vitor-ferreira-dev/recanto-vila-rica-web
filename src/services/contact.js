/**
 * @module services/contact
 * @description Envio de mensagens do formulário de contato ao administrador.
 * O backend encaminha o conteúdo por e-mail via Resend, com `replyTo` definido
 * como o e-mail do remetente para facilitar a resposta direta.
 */
import api from "./api";

/**
 * Envia uma mensagem de contato ao administrador do Recanto Vila Rica.
 *
 * @see POST /contact/message
 * @param {{ name: string, email: string, phone?: string, subject: string, message: string }} payload
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function submitContact(payload) {
    const { data } = await api.post("/contact/message", payload);
    return data;
}
