/**
 * @module services/admin
 * @description Funções de acesso à API para o painel administrativo.
 * Todos os endpoints requerem `role === "ADMIN"` — o token JWT é enviado
 * automaticamente pelo interceptor do Axios (`services/api.js`).
 */
import api from "./api";

// ─── Reservations ────────────────────────────────────────────────────────────

/**
 * Retorna um resumo de reservas com contagens por status.
 *
 * @see GET /admin/reservations/summary
 * @param {object} [filters={}] - Filtros opcionais (ex.: `{ status, venueId }`)
 * @returns {Promise<object>}
 */
export async function getReservationsSummary(filters = {}) {
    const { data } = await api.get("/admin/reservations/summary", { params: filters });
    return data.data;
}

/**
 * Lista todas as reservas do sistema com suporte a filtros.
 *
 * @see GET /admin/reservations
 * @param {object} [filters={}] - Filtros opcionais (ex.: `{ status, page }`)
 * @returns {Promise<Array>}
 */
export async function listAdminReservations(filters = {}) {
    const { data } = await api.get("/admin/reservations", { params: filters });
    return data.data;
}

/**
 * Cancela uma reserva como administrador.
 *
 * @see PATCH /admin/reservations/:id/cancel
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function cancelAdminReservation(id) {
    const { data } = await api.patch(`/admin/reservations/${id}/cancel`);
    return data.data;
}

// ─── Users ────────────────────────────────────────────────────────────────────

/**
 * Lista todos os usuários do sistema.
 *
 * @see GET /admin/users
 * @param {object} [filters={}]
 * @returns {Promise<Array>}
 */
export async function listAdminUsers(filters = {}) {
    const { data } = await api.get("/admin/users", { params: filters });
    return data.data;
}

// ─── Revenue ──────────────────────────────────────────────────────────────────

/**
 * Retorna a receita mensal agrupada por mês para um determinado ano.
 *
 * @see GET /admin/reservations/revenue/monthly
 * @param {number} year - Ex.: `2026`
 * @returns {Promise<Array<{ month: number, totalCents: number }>>}
 */
export async function getMonthlyRevenue(year) {
    const { data } = await api.get("/admin/reservations/revenue/monthly", { params: { year } });
    return data.data;
}

// ─── Campaigns ────────────────────────────────────────────────────────────────

/**
 * Lista todas as campanhas de desconto/referral/sorteio.
 *
 * @see GET /admin/campaigns
 * @returns {Promise<Array>}
 */
export async function listCampaigns() {
    const { data } = await api.get("/admin/campaigns");
    return data.data;
}

/**
 * Cria uma nova campanha.
 *
 * @see POST /admin/campaigns
 * @param {{ type: string, discountType: string, discountValue: number, startsAt: string, endsAt: string }} payload
 * @returns {Promise<object>}
 */
export async function createCampaign(payload) {
    const { data } = await api.post("/admin/campaigns", payload);
    return data.data;
}

/**
 * Atualiza uma campanha existente.
 *
 * @see PATCH /admin/campaigns/:id
 * @param {string} id
 * @param {object} payload
 * @returns {Promise<object>}
 */
export async function updateCampaign(id, payload) {
    const { data } = await api.patch(`/admin/campaigns/${id}`, payload);
    return data.data;
}

/**
 * Sorteia um ganhador para uma campanha do tipo `RAFFLE`.
 *
 * @see POST /admin/campaigns/:id/draw-winner
 * @param {string} id - ID da campanha
 * @returns {Promise<{ winner: object, grant: object }>}
 */
export async function drawRaffleWinner(id) {
    const { data } = await api.post(`/admin/campaigns/${id}/draw-winner`);
    return data.data;
}

// ─── Holidays ─────────────────────────────────────────────────────────────────

/**
 * Lista todos os feriados de um determinado ano.
 *
 * @see GET /admin/holidays
 * @param {number} year
 * @returns {Promise<Array>}
 */
export async function listHolidays(year) {
    const { data } = await api.get("/admin/holidays", { params: { year } });
    return data.data;
}

/**
 * Sincroniza feriados nacionais automaticamente via API externa para o ano informado.
 *
 * @see POST /admin/holidays/sync
 * @param {number} year
 * @returns {Promise<object>}
 */
export async function syncHolidays(year) {
    const { data } = await api.post("/admin/holidays/sync", null, { params: { year } });
    return data.data;
}

/**
 * Sincroniza feriados municipais fornecidos manualmente.
 *
 * @see POST /admin/holidays/sync-municipal
 * @param {number} year
 * @param {Array<{ date: string, name: string }>} items
 * @returns {Promise<object>}
 */
export async function syncMunicipalHolidays(year, items) {
    const { data } = await api.post("/admin/holidays/sync-municipal", { year, items });
    return data.data;
}

/**
 * Cria um feriado manualmente.
 *
 * @see POST /admin/holidays
 * @param {{ date: string, name: string }} payload
 * @returns {Promise<object>}
 */
export async function createHoliday(payload) {
    const { data } = await api.post("/admin/holidays", payload);
    return data.data;
}

/**
 * Remove um feriado pelo ID.
 *
 * @see DELETE /admin/holidays/:id
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function deleteHoliday(id) {
    const { data } = await api.delete(`/admin/holidays/${id}`);
    return data.data;
}

// ─── Plans ────────────────────────────────────────────────────────────────────

/**
 * Lista os planos de reserva configurados no sistema.
 *
 * @see GET /admin/plans
 * @param {object} [filters={}]
 * @returns {Promise<Array<{ id: string, code: string, priceCents: number, active: boolean }>>}
 */
export async function listPlans(filters = {}) {
    const { data } = await api.get("/admin/plans", { params: filters });
    return data.data;
}

/**
 * Cria um novo plano de reserva.
 *
 * @see POST /admin/plans
 * @param {{ code: string, priceCents: number, active?: boolean }} payload
 * @returns {Promise<object>}
 */
export async function createPlan(payload) {
    const { data } = await api.post("/admin/plans", payload);
    return data.data;
}

/**
 * Atualiza um plano de reserva existente.
 *
 * @see PATCH /admin/plans/:id
 * @param {string} id
 * @param {{ priceCents?: number, active?: boolean }} payload
 * @returns {Promise<object>}
 */
export async function updatePlan(id, payload) {
    const { data } = await api.patch(`/admin/plans/${id}`, payload);
    return data.data;
}

/**
 * Remove um plano de reserva.
 *
 * @see DELETE /admin/plans/:id
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function deletePlan(id) {
    const { data } = await api.delete(`/admin/plans/${id}`);
    return data.data;
}

// ─── Blocked Dates ────────────────────────────────────────────────────────────

/**
 * Lista os intervalos de datas bloqueadas (sem reservas possíveis).
 *
 * @see GET /blocked-dates
 * @param {object} [filters={}] - Ex.: `{ venueId }`
 * @returns {Promise<Array<{ id: string, startDate: string, endDate: string, venueId: string }>>}
 */
export async function listBlockedDates(filters = {}) {
    const { data } = await api.get("/blocked-dates", { params: filters });
    return data.data;
}

/**
 * Cria um novo intervalo de datas bloqueadas para um espaço.
 *
 * @see POST /blocked-dates
 * @param {{ venueId: string, startDate: string, endDate: string, reason?: string }} payload
 * @returns {Promise<object>}
 */
export async function createBlockedDate(payload) {
    const { data } = await api.post("/blocked-dates", payload);
    return data.data;
}

/**
 * Remove um intervalo de datas bloqueadas.
 *
 * @see DELETE /blocked-dates/:id
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function deleteBlockedDate(id) {
    const { data } = await api.delete(`/blocked-dates/${id}`);
    return data.data;
}
