import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import {
    createCampaign,
    createHoliday,
    deleteHoliday,
    drawRaffleWinner,
    getReservationsSummary,
    listAdminReservations,
    listCampaigns,
    listHolidays,
    syncHolidays,
    syncMunicipalHolidays,
    updateCampaign,
} from "../../services/admin";
import { server } from "../mocks/server";

const BASE = "http://localhost:3000";

describe("adminService", () => {
    it("getReservationsSummary returns summary data", async () => {
        const result = await getReservationsSummary();
        expect(result.totalReservations).toBe(10);
        expect(result.totalRevenue).toBe(500000);
    });

    it("listAdminReservations returns reservations array", async () => {
        server.use(
            http.get(`${BASE}/admin/reservations`, () =>
                HttpResponse.json({ success: true, data: [{ id: "res-1", status: "PAID" }] })
            )
        );
        const result = await listAdminReservations();
        expect(result).toHaveLength(1);
    });

    it("listCampaigns returns campaigns array", async () => {
        server.use(
            http.get(`${BASE}/admin/campaigns`, () =>
                HttpResponse.json({ success: true, data: [{ id: "camp-1", name: "Indique um amigo" }] })
            )
        );
        const result = await listCampaigns();
        expect(result[0].name).toBe("Indique um amigo");
    });

    it("createCampaign sends POST and returns new campaign", async () => {
        server.use(
            http.post(`${BASE}/admin/campaigns`, () =>
                HttpResponse.json({ success: true, data: { id: "camp-2", name: "Nova campanha" } }, { status: 201 })
            )
        );
        const result = await createCampaign({ name: "Nova campanha", code: "NOVA" });
        expect(result.id).toBe("camp-2");
    });

    it("updateCampaign sends PATCH and returns updated campaign", async () => {
        server.use(
            http.patch(`${BASE}/admin/campaigns/camp-1`, () =>
                HttpResponse.json({ success: true, data: { id: "camp-1", isActive: false } })
            )
        );
        const result = await updateCampaign("camp-1", { isActive: false });
        expect(result.isActive).toBe(false);
    });

    it("drawRaffleWinner sends POST and returns winner", async () => {
        server.use(
            http.post(`${BASE}/admin/campaigns/camp-1/draw-winner`, () =>
                HttpResponse.json({
                    success: true,
                    data: { winner: { name: "Maria", email: "maria@email.com" }, totalEntries: 5, campaignName: "Sorteio VIP" },
                })
            )
        );
        const result = await drawRaffleWinner("camp-1");
        expect(result.winner.name).toBe("Maria");
    });

    it("listHolidays returns holidays for a given year", async () => {
        server.use(
            http.get(`${BASE}/admin/holidays`, () =>
                HttpResponse.json({ success: true, data: [{ id: "h-1", name: "Natal", date: "2026-12-25" }] })
            )
        );
        const result = await listHolidays(2026);
        expect(result[0].name).toBe("Natal");
    });

    it("syncHolidays sends POST and returns synced count", async () => {
        server.use(
            http.post(`${BASE}/admin/holidays/sync`, () =>
                HttpResponse.json({ success: true, data: { synced: 12 } })
            )
        );
        const result = await syncHolidays(2026);
        expect(result.synced).toBe(12);
    });

    it("syncMunicipalHolidays sends POST and returns synced count", async () => {
        server.use(
            http.post(`${BASE}/admin/holidays/sync-municipal`, () =>
                HttpResponse.json({ success: true, data: { synced: 3 } })
            )
        );
        const result = await syncMunicipalHolidays(2026, []);
        expect(result.synced).toBe(3);
    });

    it("createHoliday sends POST and returns new holiday", async () => {
        server.use(
            http.post(`${BASE}/admin/holidays`, () =>
                HttpResponse.json({ success: true, data: { id: "h-2", name: "Feriado Teste" } }, { status: 201 })
            )
        );
        const result = await createHoliday({ name: "Feriado Teste", date: "2026-10-01", type: "national" });
        expect(result.id).toBe("h-2");
    });

    it("deleteHoliday sends DELETE", async () => {
        server.use(
            http.delete(`${BASE}/admin/holidays/h-1`, () =>
                HttpResponse.json({ success: true, data: {} })
            )
        );
        const result = await deleteHoliday("h-1");
        expect(result).toBeDefined();
    });
});
