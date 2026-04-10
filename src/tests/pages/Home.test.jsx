import { render, screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Home from "../../pages/Home";
import { server } from "../mocks/server";

const BASE = "http://localhost:3000";

function renderPage() {
    return render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    );
}

describe("Home page", () => {
    it("shows greeting and stats after loading", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getByText(/total de reservas/i)).toBeInTheDocument()
        );
        expect(screen.getAllByText(/espaços disponíveis/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/próximas reservas/i).length).toBeGreaterThan(0);
    });

    it("shows user first name in greeting", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getByText(/mateus/i)).toBeInTheDocument()
        );
    });

    it("shows empty state for upcoming reservations when list is empty", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getByText(/nenhuma reserva futura encontrada/i)).toBeInTheDocument()
        );
    });

    it("shows upcoming reservations when data is present", async () => {
        server.use(
            http.get(`${BASE}/reservations`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "res-1",
                            status: "PENDING",
                            startDate: new Date(Date.now() + 86400000).toISOString(),
                            endDate: new Date(Date.now() + 86400000 * 2).toISOString(),
                            venue: { name: "Salão Principal" },
                        },
                    ],
                })
            )
        );
        renderPage();
        await waitFor(() =>
            expect(screen.getAllByText("Salão Principal").length).toBeGreaterThan(0)
        );
        expect(screen.getByText("Pendente")).toBeInTheDocument();
    });

    it("shows venue price chip when basePrice is present", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getByText(/a partir de/i)).toBeInTheDocument()
        );
    });

    it("does not show price chip when basePrice is null", async () => {
        server.use(
            http.get(`${BASE}/venues`, () =>
                HttpResponse.json({
                    success: true,
                    data: [{ id: "venue-1", name: "Salão Principal", location: "Lavras", basePrice: null }],
                })
            )
        );
        renderPage();
        await waitFor(() =>
            expect(screen.getByText("Salão Principal")).toBeInTheDocument()
        );
        expect(screen.queryByText(/a partir de/i)).not.toBeInTheDocument();
    });

    it("shows grants panel when user has available discounts", async () => {
        server.use(
            http.get(`${BASE}/promotions/my-grants`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "grant-1",
                            percentOff: 10,
                            validUntil: "2027-01-01T00:00:00.000Z",
                            campaign: { name: "Indique um amigo" },
                        },
                    ],
                })
            )
        );
        renderPage();
        await waitFor(() =>
            expect(screen.getByText(/seus descontos disponíveis/i)).toBeInTheDocument()
        );
        expect(screen.getByText("10% OFF")).toBeInTheDocument();
    });

    it("does not show grants panel when user has no discounts", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getByText(/total de reservas/i)).toBeInTheDocument()
        );
        expect(screen.queryByText(/seus descontos disponíveis/i)).not.toBeInTheDocument();
    });

    it("shows grant with no expiry date", async () => {
        server.use(
            http.get(`${BASE}/promotions/my-grants`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "grant-1",
                            percentOff: 15,
                            validUntil: null,
                            campaign: { name: "Fidelidade" },
                        },
                    ],
                })
            )
        );
        renderPage();
        await waitFor(() =>
            expect(screen.getByText(/sem data de expiração/i)).toBeInTheDocument()
        );
    });

    it("shows empty state when venues list is empty", async () => {
        server.use(
            http.get(`${BASE}/venues`, () =>
                HttpResponse.json({ success: true, data: [] })
            )
        );
        renderPage();
        await waitFor(() =>
            expect(screen.getByText(/nenhum espaço encontrado/i)).toBeInTheDocument()
        );
    });

    it("shows loading state initially", () => {
        renderPage();
        expect(screen.getByText(/carregando seu painel/i)).toBeInTheDocument();
    });
});
