import { http, HttpResponse } from "msw";

const BASE_URL = "http://localhost:3000";

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authHandlers = [
    http.post(`${BASE_URL}/auth/login`, () =>
        HttpResponse.json({
            success: true,
            message: "Login successful",
            data: {
                token: "fake-token",
                user: { id: "user-1", name: "Mateus", email: "mateus@email.com", role: "USER" },
            },
        })
    ),
];

// ─── Users ───────────────────────────────────────────────────────────────────

export const userHandlers = [
    http.get(`${BASE_URL}/users/me`, () =>
        HttpResponse.json({
            success: true,
            data: { id: "user-1", name: "Mateus", email: "mateus@email.com", role: "USER", phone: null, birthDate: null },
        })
    ),

    http.patch(`${BASE_URL}/users/:id`, () =>
        HttpResponse.json({
            success: true,
            data: { id: "user-1", name: "Mateus Atualizado", email: "mateus@email.com", role: "USER" },
        })
    ),
];

// ─── Venues ──────────────────────────────────────────────────────────────────

export const venueHandlers = [
    http.get(`${BASE_URL}/venues`, () =>
        HttpResponse.json({
            success: true,
            data: [
                { id: "venue-1", name: "Salão Principal", location: "Lavras - MG", basePrice: 65000 },
            ],
        })
    ),

    http.get(`${BASE_URL}/venues/:id`, () =>
        HttpResponse.json({
            success: true,
            data: {
                id: "venue-1",
                name: "Salão Principal",
                location: "Lavras - MG",
                description: "Salão para eventos e celebrações",
                capacity: 150,
                hasKidsArea: false,
                hasPool: false,
            },
        })
    ),
];

// ─── Reservations ────────────────────────────────────────────────────────────

export const reservationHandlers = [
    http.get(`${BASE_URL}/reservations`, () =>
        HttpResponse.json({ success: true, data: [] })
    ),

    http.get(`${BASE_URL}/reservations/:id`, () =>
        HttpResponse.json({
            success: true,
            data: {
                id: "res-1",
                status: "PENDING",
                planCode: "ESSENCIAL",
                totalPrice: 85000,
                checkoutUrl: "https://stripe.com/pay/session-1",
                startDate: "2026-06-01T10:00:00.000Z",
                endDate: "2026-06-01T18:00:00.000Z",
                venue: { name: "Salão Principal" },
            },
        })
    ),

    http.post(`${BASE_URL}/reservations/quote`, () =>
        HttpResponse.json({
            success: true,
            data: {
                totalCents: 85000,
                subtotalCents: 85000,
                discountCents: 0,
                discountApplied: false,
                items: [{ description: "Aluguel do salão", amountCents: 85000 }],
                planCode: "ESSENCIAL",
                currency: "BRL",
            },
        })
    ),

    http.post(`${BASE_URL}/reservations`, () =>
        HttpResponse.json(
            { success: true, data: { id: "res-new", status: "PENDING" } },
            { status: 201 }
        )
    ),
];

// ─── Promotions ──────────────────────────────────────────────────────────────

export const promotionHandlers = [
    http.get(`${BASE_URL}/promotions/my-grants`, () =>
        HttpResponse.json({ success: true, data: [] })
    ),
];

// ─── Referrals ───────────────────────────────────────────────────────────────

export const referralHandlers = [
    http.get(`${BASE_URL}/referrals`, () =>
        HttpResponse.json({ success: true, data: [] })
    ),

    http.post(`${BASE_URL}/referrals`, () =>
        HttpResponse.json({
            success: true,
            data: {
                id: "ref-1",
                referredEmail: "amigo@email.com",
                status: "PENDING",
                createdAt: new Date().toISOString(),
                campaign: { id: "camp-1", name: "Indique um amigo" },
            },
        }, { status: 201 })
    ),
];

// ─── Admin ───────────────────────────────────────────────────────────────────

export const adminHandlers = [
    http.get(`${BASE_URL}/admin/reservations/summary`, () =>
        HttpResponse.json({
            success: true,
            data: {
                totalReservations: 10,
                totalRevenue: 500000,
                pendingReservations: 2,
                paidReservations: 7,
                cancelledReservations: 1,
                expiredReservations: 0,
            },
        })
    ),

    http.get(`${BASE_URL}/admin/reservations`, () =>
        HttpResponse.json({ success: true, data: [] })
    ),

    http.get(`${BASE_URL}/admin/campaigns`, () =>
        HttpResponse.json({ success: true, data: [] })
    ),

    http.get(`${BASE_URL}/admin/holidays`, () =>
        HttpResponse.json({ success: true, data: [] })
    ),
];

// ─── All handlers ─────────────────────────────────────────────────────────────

export const handlers = [
    ...authHandlers,
    ...userHandlers,
    ...venueHandlers,
    ...reservationHandlers,
    ...promotionHandlers,
    ...referralHandlers,
    ...adminHandlers,
];
