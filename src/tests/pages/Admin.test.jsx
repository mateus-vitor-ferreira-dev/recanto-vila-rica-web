import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { describe, expect, it } from "vitest";
import Admin from "../../pages/Admin";
import { server } from "../mocks/server";

const BASE = "http://localhost:3000";

function renderPage() {
    return render(
        <MemoryRouter>
            <Admin />
            <ToastContainer />
        </MemoryRouter>
    );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

describe("Admin - Dashboard tab", () => {
    it("shows summary metrics after loading", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getByText("10")).toBeInTheDocument()
        );
        expect(screen.getByText(/total de reservas/i)).toBeInTheDocument();
        expect(screen.getByText(/receita confirmada/i)).toBeInTheDocument();
    });
});

// ─── Reservations ─────────────────────────────────────────────────────────────

describe("Admin - Reservations tab", () => {
    it("shows empty state when no reservations", async () => {
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /^reservas$/i }));

        await waitFor(() =>
            expect(screen.getByText(/nenhuma reserva encontrada/i)).toBeInTheDocument()
        );
    });

    it("shows reservations list with filters", async () => {
        server.use(
            http.get(`${BASE}/admin/reservations`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "res-1",
                            userId: "user-1",
                            venueId: "venue-1",
                            status: "PAID",
                            planCode: "ESSENCIAL",
                            totalPrice: 85000,
                            startDate: "2026-06-01T10:00:00.000Z",
                            endDate: "2026-06-01T18:00:00.000Z",
                            user: { name: "Mateus" },
                            venue: { name: "Salão Principal" },
                        },
                    ],
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /^reservas$/i }));

        await waitFor(() =>
            expect(screen.getByText("Mateus")).toBeInTheDocument()
        );
        expect(screen.getByText("Salão Principal")).toBeInTheDocument();
    });

    it("shows disabled Anterior button on first page", async () => {
        server.use(
            http.get(`${BASE}/admin/reservations`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "res-1",
                            status: "PENDING",
                            planCode: "ESSENCIAL",
                            totalPrice: 85000,
                            startDate: "2026-06-01T10:00:00.000Z",
                            endDate: "2026-06-01T18:00:00.000Z",
                            user: { name: "Mateus" },
                            venue: { name: "Salão Principal" },
                        },
                    ],
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /^reservas$/i }));

        await waitFor(() =>
            expect(screen.getByRole("button", { name: /anterior/i })).toBeDisabled()
        );
    });

    it("shows truncated userId and venueId when user and venue are null, and '—' for missing planCode", async () => {
        server.use(
            http.get(`${BASE}/admin/reservations`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "res-null",
                            userId: "user-abc123456",
                            venueId: "venue-xyz",
                            status: "UNKNOWN_STATUS",
                            planCode: null,
                            totalPrice: 0,
                            startDate: "2026-06-01T10:00:00.000Z",
                            endDate: "2026-06-01T18:00:00.000Z",
                            user: null,
                            venue: null,
                        },
                    ],
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /^reservas$/i }));

        await waitFor(() =>
            expect(screen.getByText("user-abc...")).toBeInTheDocument()
        );
        expect(screen.getByText("venue-xyz")).toBeInTheDocument();
        expect(screen.getByText("—")).toBeInTheDocument();
        expect(screen.getByText("UNKNOWN_STATUS")).toBeInTheDocument();
    });

    it("enables Próxima button and navigates to page 2 when there are 15 results", async () => {
        const reservations = Array.from({ length: 15 }, (_, i) => ({
            id: `res-${i}`,
            userId: `user-${i}`,
            venueId: `venue-${i}`,
            status: "PAID",
            planCode: "ESSENCIAL",
            totalPrice: 1000,
            startDate: "2026-06-01T10:00:00.000Z",
            endDate: "2026-06-01T18:00:00.000Z",
            user: { name: `User ${i}` },
            venue: { name: `Salão ${i}` },
        }));
        server.use(
            http.get(`${BASE}/admin/reservations`, () =>
                HttpResponse.json({ success: true, data: reservations })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /^reservas$/i }));
        await waitFor(() =>
            expect(screen.getByRole("button", { name: /próxima/i })).not.toBeDisabled()
        );

        await user.click(screen.getByRole("button", { name: /próxima/i }));
        await waitFor(() =>
            expect(screen.getByText(/página 2/i)).toBeInTheDocument()
        );
    });
});

// ─── Campaigns ────────────────────────────────────────────────────────────────

describe("Admin - Campaigns tab", () => {
    it("shows empty state when no campaigns", async () => {
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /campanhas/i }));

        await waitFor(() =>
            expect(screen.getByText(/nenhuma campanha cadastrada/i)).toBeInTheDocument()
        );
    });

    it("opens and closes create campaign modal", async () => {
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /campanhas/i }));
        await waitFor(() => screen.getByRole("button", { name: /nova campanha/i }));

        await user.click(screen.getByRole("button", { name: /nova campanha/i }));
        expect(screen.getByText(/nova campanha/i, { selector: "h2, h3" })).toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: /cancelar/i }));
        await waitFor(() =>
            expect(screen.queryByRole("button", { name: /cancelar/i })).not.toBeInTheDocument()
        );
    });

    it("shows campaigns list with toggle and status badge", async () => {
        server.use(
            http.get(`${BASE}/admin/campaigns`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "camp-1",
                            name: "Indique um amigo",
                            code: "REFERRAL_2026",
                            type: "REFERRAL_NEXT_BOOKING",
                            isActive: true,
                            startsAt: new Date(Date.now() - 86400000).toISOString(),
                            endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
                        },
                    ],
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /campanhas/i }));

        await waitFor(() =>
            expect(screen.getByText("Indique um amigo")).toBeInTheDocument()
        );
        expect(screen.getByText("Ativa")).toBeInTheDocument();
    });

    it("toggles campaign active state", async () => {
        server.use(
            http.get(`${BASE}/admin/campaigns`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "camp-1",
                            name: "Indique um amigo",
                            code: "REFERRAL_2026",
                            type: "REFERRAL_NEXT_BOOKING",
                            isActive: true,
                            startsAt: new Date(Date.now() - 86400000).toISOString(),
                            endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
                        },
                    ],
                })
            ),
            http.patch(`${BASE}/admin/campaigns/camp-1`, () =>
                HttpResponse.json({ success: true, data: { id: "camp-1", isActive: false } })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /campanhas/i }));
        await waitFor(() => screen.getByRole("button", { name: /desativar/i }));

        await user.click(screen.getByRole("button", { name: /desativar/i }));
        await waitFor(() =>
            expect(screen.getByText(/desativada com sucesso/i)).toBeInTheDocument()
        );
    });

    it("shows RAFFLE_VIP campaign with draw button when active", async () => {
        server.use(
            http.get(`${BASE}/admin/campaigns`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "camp-2",
                            name: "Sorteio VIP",
                            code: "RAFFLE_2026",
                            type: "RAFFLE_VIP",
                            isActive: true,
                            startsAt: new Date(Date.now() - 86400000).toISOString(),
                            endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
                        },
                    ],
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /campanhas/i }));
        await waitFor(() =>
            expect(screen.getByRole("button", { name: /realizar sorteio/i })).toBeInTheDocument()
        );
    });

    it("draws raffle winner and shows winner modal", async () => {
        server.use(
            http.get(`${BASE}/admin/campaigns`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "camp-2",
                            name: "Sorteio VIP",
                            code: "RAFFLE_2026",
                            type: "RAFFLE_VIP",
                            isActive: true,
                            startsAt: new Date(Date.now() - 86400000).toISOString(),
                            endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
                        },
                    ],
                })
            ),
            http.post(`${BASE}/admin/campaigns/camp-2/draw-winner`, () =>
                HttpResponse.json({
                    success: true,
                    data: {
                        winner: { name: "Maria", email: "maria@email.com", phone: "35999999999" },
                        totalEntries: 5,
                        campaignName: "Sorteio VIP",
                    },
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /campanhas/i }));
        await waitFor(() => screen.getByRole("button", { name: /realizar sorteio/i }));

        await user.click(screen.getByRole("button", { name: /realizar sorteio/i }));
        await waitFor(() =>
            expect(screen.getByText("Maria")).toBeInTheDocument()
        );
        expect(screen.getByText("maria@email.com")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /copiar mensagem/i })).toBeInTheDocument();
    });

    it("shows Ativar button for an inactive campaign", async () => {
        server.use(
            http.get(`${BASE}/admin/campaigns`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "camp-inactive",
                            name: "Campanha Inativa",
                            code: "INACTIVE_2026",
                            type: "REFERRAL_NEXT_BOOKING",
                            isActive: false,
                            startsAt: new Date(Date.now() - 86400000).toISOString(),
                            endsAt: new Date(Date.now() + 86400000).toISOString(),
                        },
                    ],
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /campanhas/i }));
        await waitFor(() =>
            expect(screen.getByRole("button", { name: /^ativar$/i })).toBeInTheDocument()
        );
    });

    it("shows LOYALTY_ALWAYS_HERE campaign with 'O ANO TODO' date display", async () => {
        server.use(
            http.get(`${BASE}/admin/campaigns`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "camp-loyalty",
                            name: "Programa Fidelidade",
                            code: "LOYALTY_2026",
                            type: "LOYALTY_ALWAYS_HERE",
                            isActive: true,
                            startsAt: new Date(Date.now() - 86400000).toISOString(),
                            endsAt: new Date(Date.now() + 86400000 * 365).toISOString(),
                        },
                    ],
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /campanhas/i }));
        await waitFor(() =>
            expect(screen.getByText("O ANO TODO")).toBeInTheDocument()
        );
    });

    it("draws raffle winner without phone and shows singular 'participante'", async () => {
        server.use(
            http.get(`${BASE}/admin/campaigns`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "camp-raffle",
                            name: "Sorteio VIP",
                            code: "RAFFLE_2026",
                            type: "RAFFLE_VIP",
                            isActive: true,
                            startsAt: new Date(Date.now() - 86400000).toISOString(),
                            endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
                        },
                    ],
                })
            ),
            http.post(`${BASE}/admin/campaigns/camp-raffle/draw-winner`, () =>
                HttpResponse.json({
                    success: true,
                    data: {
                        winner: { name: "João", email: "joao@email.com", phone: null },
                        totalEntries: 1,
                        campaignName: "Sorteio VIP",
                    },
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /campanhas/i }));
        await waitFor(() => screen.getByRole("button", { name: /realizar sorteio/i }));

        await user.click(screen.getByRole("button", { name: /realizar sorteio/i }));
        await waitFor(() =>
            expect(screen.getByText("João")).toBeInTheDocument()
        );
        expect(screen.getByText(/1 participante$/i)).toBeInTheDocument();
        expect(screen.queryByText("null")).not.toBeInTheDocument();
    });

    it("copies winner message and shows 'Copiado!' feedback", async () => {
        server.use(
            http.get(`${BASE}/admin/campaigns`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "camp-copy",
                            name: "Sorteio VIP",
                            code: "RAFFLE_COPY",
                            type: "RAFFLE_VIP",
                            isActive: true,
                            startsAt: new Date(Date.now() - 86400000).toISOString(),
                            endsAt: new Date(Date.now() + 86400000 * 30).toISOString(),
                        },
                    ],
                })
            ),
            http.post(`${BASE}/admin/campaigns/camp-copy/draw-winner`, () =>
                HttpResponse.json({
                    success: true,
                    data: {
                        winner: { name: "Ana", email: "ana@email.com", phone: "35999990000" },
                        totalEntries: 3,
                        campaignName: "Sorteio VIP",
                    },
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /campanhas/i }));
        await waitFor(() => screen.getByRole("button", { name: /realizar sorteio/i }));
        await user.click(screen.getByRole("button", { name: /realizar sorteio/i }));
        await waitFor(() => screen.getByRole("button", { name: /copiar mensagem/i }));

        await user.click(screen.getByRole("button", { name: /copiar mensagem/i }));
        await waitFor(() =>
            expect(screen.getByRole("button", { name: /copiado/i })).toBeInTheDocument()
        );
    });

    it("closes create campaign modal when clicking the overlay", async () => {
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /campanhas/i }));
        await waitFor(() => screen.getByRole("button", { name: /nova campanha/i }));

        await user.click(screen.getByRole("button", { name: /nova campanha/i }));
        const cancelButton = await screen.findByRole("button", { name: /cancelar/i });
        expect(cancelButton).toBeInTheDocument();

        // Traverse: cancel → ModalActions → form → ModalBox → ModalOverlay
        const overlay = cancelButton.closest("form")?.parentElement?.parentElement;
        if (overlay) {
            const { fireEvent: fe } = await import("@testing-library/react");
            fe.click(overlay);
        }

        await waitFor(() =>
            expect(screen.queryByRole("button", { name: /cancelar/i })).not.toBeInTheDocument()
        );
    });

    it("creates a campaign via the modal form", async () => {
        server.use(
            http.post(`${BASE}/admin/campaigns`, () =>
                HttpResponse.json({ success: true, data: { id: "camp-new", name: "Nova Campanha" } }, { status: 201 })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /campanhas/i }));
        await waitFor(() => screen.getByRole("button", { name: /nova campanha/i }));

        await user.click(screen.getByRole("button", { name: /nova campanha/i }));

        await user.type(screen.getByPlaceholderText(/ex: indique um amigo/i), "Nova Campanha");
        await user.type(screen.getByPlaceholderText(/ex: referral_2026/i), "NOVA_2026");

        const allDateInputs = document.querySelectorAll('input[type="date"]');
        if (allDateInputs[0]) {
            const { fireEvent: fe } = await import("@testing-library/react");
            fe.change(allDateInputs[0], { target: { value: "2026-01-01" } });
            fe.change(allDateInputs[1], { target: { value: "2026-12-31" } });
        }

        await user.click(screen.getByRole("button", { name: /^criar campanha$/i }));
        await waitFor(() =>
            expect(screen.getByText(/criada com sucesso/i)).toBeInTheDocument()
        );
    });
});

// ─── Holidays ─────────────────────────────────────────────────────────────────

describe("Admin - Holidays tab", () => {
    it("shows empty state when no holidays", async () => {
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /feriados/i }));

        await waitFor(() =>
            expect(screen.getByText(/nenhum feriado cadastrado/i)).toBeInTheDocument()
        );
    });

    it("shows holidays list", async () => {
        server.use(
            http.get(`${BASE}/admin/holidays`, () =>
                HttpResponse.json({
                    success: true,
                    data: [{ id: "h-1", name: "Natal", date: "2026-12-25T00:00:00.000Z", type: "national" }],
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /feriados/i }));

        await waitFor(() =>
            expect(screen.getByText("Natal")).toBeInTheDocument()
        );
    });

    it("deletes a holiday", async () => {
        server.use(
            http.get(`${BASE}/admin/holidays`, () =>
                HttpResponse.json({
                    success: true,
                    data: [{ id: "h-1", name: "Natal", date: "2026-12-25T00:00:00.000Z", type: "national" }],
                })
            ),
            http.delete(`${BASE}/admin/holidays/h-1`, () =>
                HttpResponse.json({ success: true, data: {} })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /feriados/i }));
        await waitFor(() => screen.getByRole("button", { name: /remover/i }));

        await user.click(screen.getByRole("button", { name: /remover/i }));
        await waitFor(() =>
            expect(screen.queryByText("Natal")).not.toBeInTheDocument()
        );
    });

    it("syncs national holidays", async () => {
        server.use(
            http.post(`${BASE}/admin/holidays/sync`, () =>
                HttpResponse.json({ success: true, data: { synced: 12 } })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /feriados/i }));
        await waitFor(() => screen.getByRole("button", { name: /sincronizar feriados nacionais/i }));

        await user.click(screen.getByRole("button", { name: /sincronizar feriados nacionais/i }));
        await waitFor(() =>
            expect(screen.getByText(/12 feriados nacionais sincronizados/i)).toBeInTheDocument()
        );
    });

    it("syncs municipal holidays", async () => {
        server.use(
            http.post(`${BASE}/admin/holidays/sync-municipal`, () =>
                HttpResponse.json({ success: true, data: { synced: 3 } })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /feriados/i }));
        await waitFor(() => screen.getByRole("button", { name: /sincronizar feriados municipais/i }));

        await user.click(screen.getByRole("button", { name: /sincronizar feriados municipais/i }));
        await waitFor(() =>
            expect(screen.getByText(/3 feriados municipais de lavras sincronizados/i)).toBeInTheDocument()
        );
    });

    it("opens create holiday modal and creates a holiday", async () => {
        server.use(
            http.post(`${BASE}/admin/holidays`, () =>
                HttpResponse.json({ success: true, data: { id: "h-new", name: "Feriado Teste" } }, { status: 201 })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /feriados/i }));
        await waitFor(() => screen.getByRole("button", { name: /\+ novo feriado/i }));

        await user.click(screen.getByRole("button", { name: /\+ novo feriado/i }));
        await user.type(screen.getByPlaceholderText(/ex: consciência negra/i), "Feriado Teste");

        const dateInput = document.querySelector('input[type="date"]');
        const { fireEvent: fe } = await import("@testing-library/react");
        fe.change(dateInput, { target: { value: "2026-11-20" } });

        await user.click(screen.getByRole("button", { name: /^criar feriado$/i }));
        await waitFor(() =>
            expect(screen.getByText(/feriado criado com sucesso/i)).toBeInTheDocument()
        );
    });

    it("changes year filter", async () => {
        const user = userEvent.setup();
        renderPage();
        await waitFor(() => screen.getByText(/total de reservas/i));

        await user.click(screen.getByRole("button", { name: /feriados/i }));
        await waitFor(() => screen.getByRole("combobox"));

        const yearSelect = screen.getByRole("combobox");
        await user.selectOptions(yearSelect, String(new Date().getFullYear() + 1));

        await waitFor(() =>
            expect(screen.getByText(/nenhum feriado cadastrado/i)).toBeInTheDocument()
        );
    });

    it("shows error toast when summary load fails", async () => {
        server.use(
            http.get(`${BASE}/admin/reservations/summary`, () =>
                HttpResponse.json({ success: false }, { status: 500 })
            )
        );

        renderPage();

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(/500/i);
        });
    });

    it("shows error toast when deleting holiday fails", async () => {
        server.use(
            http.get(`${BASE}/admin/holidays`, () =>
                HttpResponse.json({
                    success: true,
                    data: [
                        {
                            id: "holiday-1",
                            name: "Natal",
                            date: "2026-12-25",
                            type: "national",
                        },
                    ],
                })
            ),
            http.delete(`${BASE}/admin/holidays/:holidayId`, () =>
                HttpResponse.json({ success: false }, { status: 500 })
            )
        );

        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: /feriados/i }));

        const deleteButton = await screen.findByRole("button", {
            name: /remover/i,
        });

        await user.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(/500/i);
        });
    });

    it("shows error toast when syncing national holidays fails", async () => {
        server.use(
            http.post(`${BASE}/admin/holidays/sync`, () =>
                HttpResponse.json({ success: false }, { status: 500 })
            )
        );

        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: /feriados/i }));

        await user.click(
            screen.getByRole("button", { name: /sincronizar feriados nacionais/i })
        );

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(/500/i);
        });
    });

    it("shows error toast when syncing municipal holidays fails", async () => {
        server.use(
            http.post(`${BASE}/admin/holidays/sync-municipal`, () =>
                HttpResponse.json({ success: false }, { status: 500 })
            )
        );

        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: /feriados/i }));

        await user.click(
            screen.getByRole("button", { name: /sincronizar feriados municipais/i })
        );

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(/500/i);
        });
    });

    it("shows error toast when creating holiday fails", async () => {
        server.use(
            http.post(`${BASE}/admin/holidays`, () =>
                HttpResponse.json({ success: false }, { status: 500 })
            )
        );

        const user = userEvent.setup();
        renderPage();

        await user.click(screen.getByRole("button", { name: /feriados/i }));
        await user.click(screen.getByRole("button", { name: /novo feriado/i }));

        await user.type(
            screen.getByPlaceholderText(/consciência negra/i),
            "Feriado Teste"
        );

        const dateInput = document.querySelector("input[type='date']");
        await user.type(dateInput, "2026-12-25");

        await user.click(screen.getByRole("button", { name: /criar feriado/i }));

        await waitFor(() => {
            expect(screen.getByRole("alert")).toHaveTextContent(/500/i);
        });
    });

});
