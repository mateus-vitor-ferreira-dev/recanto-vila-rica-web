/**
 * @module services/auth
 * @description Funções para o fluxo de recuperação de senha.
 */
import api from "./api";

/**
 * Solicita o envio de um e-mail com link de redefinição de senha.
 * Sempre retorna sucesso — o backend não revela se o e-mail existe.
 *
 * @see POST /auth/forgot-password
 * @param {string} email - E-mail cadastrado na conta
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function forgotPassword(email) {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data;
}

/**
 * Redefine a senha usando o token recebido por e-mail.
 *
 * @see POST /auth/reset-password
 * @param {string} token - Token do link de redefinição (query param `?token=`)
 * @param {string} password - Nova senha (mín. 8 chars, maiúscula, número e especial)
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function resetPassword(token, password) {
    const { data } = await api.post("/auth/reset-password", { token, password });
    return data;
}

/**
 * Reenvia o e-mail de verificação para o usuário autenticado.
 * Requer JWT válido no header Authorization.
 *
 * @see POST /auth/resend-verification
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function resendVerification() {
    const { data } = await api.post("/auth/resend-verification");
    return data;
}

/**
 * Verifica se a senha atual do usuário autenticado está correta.
 * Lança erro 401 se a senha estiver incorreta.
 *
 * @see POST /users/me/verify-password
 * @param {string} currentPassword
 * @returns {Promise<void>}
 */
export async function verifyCurrentPassword(currentPassword) {
    await api.post("/users/me/verify-password", { currentPassword });
}
