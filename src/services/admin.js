import api from "./api";

// Reservations
export async function getReservationsSummary(filters = {}) {
    const { data } = await api.get("/admin/reservations/summary", { params: filters });
    return data.data;
}

export async function listAdminReservations(filters = {}) {
    const { data } = await api.get("/admin/reservations", { params: filters });
    return data.data;
}

// Campaigns
export async function listCampaigns() {
    const { data } = await api.get("/admin/campaigns");
    return data.data;
}

export async function createCampaign(payload) {
    const { data } = await api.post("/admin/campaigns", payload);
    return data.data;
}

export async function updateCampaign(id, payload) {
    const { data } = await api.patch(`/admin/campaigns/${id}`, payload);
    return data.data;
}

export async function drawRaffleWinner(id) {
    const { data } = await api.post(`/admin/campaigns/${id}/draw-winner`);
    return data.data;
}

// Holidays
export async function listHolidays(year) {
    const { data } = await api.get("/admin/holidays", { params: { year } });
    return data.data;
}

export async function syncHolidays(year) {
    const { data } = await api.post("/admin/holidays/sync", null, { params: { year } });
    return data.data;
}

export async function syncMunicipalHolidays(year, items) {
    const { data } = await api.post("/admin/holidays/sync-municipal", { year, items });
    return data.data;
}

export async function createHoliday(payload) {
    const { data } = await api.post("/admin/holidays", payload);
    return data.data;
}

export async function deleteHoliday(id) {
    const { data } = await api.delete(`/admin/holidays/${id}`);
    return data.data;
}
