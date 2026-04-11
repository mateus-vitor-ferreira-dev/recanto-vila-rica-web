import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { describe, expect, it, vi } from "vitest";
import ReservationIntent from "../../pages/ReservationIntent";
import { server } from "../mocks/server";

const BASE = "http://localhost:3000";

const mockVenue = {
    id: "venue-1",
    name: "Salão Principal",
    location: "Lavras - MG",
    description: "Salão para eventos",
    capacity: 150,
    hasKidsArea: false,
    hasPool: false,
};

function renderPage(venueId = "venue-1") {
    return render(
        <MemoryRouter initialEntries={[`/reservation-intent/${venueId}`]}>
            <Routes>
                <Route path="/reservation-intent/:venueId" element={<ReservationIntent />} />
                <Route path="/checkout/:reservationId" element={<div>Checkout Page</div>} />
            </Routes>
            <ToastContainer />
        </MemoryRouter>
    );
}

/** Preenche data e horários via fireEvent (jsdom não associa label ao input sem htmlFor) */
function fillDateTime(container, { date = "2027-06-15", start = "10:00", end = "18:00" } = {}) {
    const dateInput = container.querySelector('input[type="date"]');
    const timeInputs = container.querySelectorAll('input[type="time"]');
    if (date) fireEvent.change(dateInput, { target: { value: date } });
    if (start) fireEvent.change(timeInputs[0], { target: { value: start } });
    if (end) fireEvent.change(timeInputs[1], { target: { value: end } });
}

describe("ReservationIntent page", () => {
    it("shows loading state then renders venue details", async () => {
        renderPage();
        expect(screen.getByText(/carregando dados do salão/i)).toBeInTheDocument();
        await waitFor(() =>
            expect(screen.getAllByText("Salão Principal").length).toBeGreaterThan(0)
        );
        expect(screen.getByText("150 pessoas")).toBeInTheDocument();
        expect(screen.getByText("Lavras - MG")).toBeInTheDocument();
    });

    it("shows 'Salão não encontrado' when venue returns null", async () => {
        server.use(
            http.get(`${BASE}/venues/:id`, () =>
                HttpResponse.json({ success: true, data: null })
            )
        );
        renderPage();
        await waitFor(() =>
            expect(screen.getByText(/salão não encontrado/i)).toBeInTheDocument()
        );
    });

    it("shows error toast when venue load fails", async () => {
        server.use(
            http.get(`${BASE}/venues/:id`, () =>
                HttpResponse.json(
                    { success: false, message: "Erro ao carregar os dados do salão." },
                    { status: 500 }
                )
            )
        );
        renderPage();
        await waitFor(() =>
            expect(screen.getByText(/erro ao carregar os dados do salão/i)).toBeInTheDocument()
        );
    });

    it("renders all three plans", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getAllByText("Salão Principal").length).toBeGreaterThan(0)
        );
        expect(screen.getByText("Promocional")).toBeInTheDocument();
        expect(screen.getByText("Essencial")).toBeInTheDocument();
        expect(screen.getByText("Completa")).toBeInTheDocument();
    });

    it("selecting a plan updates the summary", async () => {
        const user = userEvent.setup();
        renderPage();
        await waitFor(() =>
            expect(screen.getByText("Essencial")).toBeInTheDocument()
        );
        await user.click(screen.getByText("Essencial"));
        expect(screen.getAllByText("Essencial").length).toBeGreaterThan(1);
    });

    it("shows base plan price in estimated card when date/time not filled", async () => {
        const user = userEvent.setup();
        renderPage();
        await waitFor(() =>
            expect(screen.getByText("Promocional")).toBeInTheDocument()
        );
        await user.click(screen.getByText("Promocional"));
        await waitFor(() =>
            expect(screen.getAllByText(/r\$ 650/i).length).toBeGreaterThan(0)
        );
    });

    it("fetches quote when plan and date/time are all filled", async () => {
        const { container } = renderPage();
        const user = userEvent.setup();
        await waitFor(() =>
            expect(screen.getByText("Essencial")).toBeInTheDocument()
        );
        await user.click(screen.getByText("Essencial"));
        fillDateTime(container);

        await waitFor(() =>
            expect(screen.getAllByText(/r\$ 850/i).length).toBeGreaterThan(0),
            { timeout: 2000 }
        );
    });

    it("shows quote with discount when discountApplied is true", async () => {
        server.use(
            http.post(`${BASE}/reservations/quote`, () =>
                HttpResponse.json({
                    success: true,
                    data: {
                        totalCents: 76500,
                        subtotalCents: 85000,
                        discountCents: 8500,
                        discountApplied: true,
                        items: [{ description: "Aluguel", amountCents: 85000 }],
                    },
                })
            )
        );
        const { container } = renderPage();
        const user = userEvent.setup();
        await waitFor(() =>
            expect(screen.getByText("Essencial")).toBeInTheDocument()
        );
        await user.click(screen.getByText("Essencial"));
        fillDateTime(container);

        await waitFor(() =>
            expect(screen.getByText(/subtotal/i)).toBeInTheDocument(),
            { timeout: 2000 }
        );
        expect(screen.getByText(/desconto/i)).toBeInTheDocument();
    });

    it("does not quote when end time is before start time", async () => {
        const quoteMock = vi.fn(() =>
            HttpResponse.json({
                success: true,
                data: { totalCents: 85000, subtotalCents: 85000, discountCents: 0, discountApplied: false, items: [] },
            })
        );
        server.use(http.post(`${BASE}/reservations/quote`, quoteMock));

        const { container } = renderPage();
        const user = userEvent.setup();
        await waitFor(() =>
            expect(screen.getByText("Essencial")).toBeInTheDocument()
        );
        await user.click(screen.getByText("Essencial"));
        fillDateTime(container, { start: "18:00", end: "10:00" });

        await new Promise((r) => setTimeout(r, 800));
        expect(quoteMock).not.toHaveBeenCalled();
    });

    it("opens Google Maps when 'Rotas' is clicked and location is set", async () => {
        const openMock = vi.spyOn(window, "open").mockImplementation(() => null);
        const user = userEvent.setup();
        renderPage();
        await waitFor(() =>
            expect(screen.getByRole("button", { name: /rotas/i })).toBeInTheDocument()
        );
        await user.click(screen.getByRole("button", { name: /rotas/i }));
        expect(openMock).toHaveBeenCalledWith(
            expect.stringContaining("google.com/maps"),
            "_blank"
        );
        openMock.mockRestore();
    });

    it("shows toast when 'Rotas' clicked and location is missing", async () => {
        server.use(
            http.get(`${BASE}/venues/:id`, () =>
                HttpResponse.json({
                    success: true,
                    data: { ...mockVenue, location: null },
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() =>
            expect(screen.getByRole("button", { name: /rotas/i })).toBeInTheDocument()
        );
        await user.click(screen.getByRole("button", { name: /rotas/i }));
        await waitFor(() =>
            expect(screen.getByText(/endereço do salão não disponível/i)).toBeInTheDocument()
        );
    });

    it("shows warning when confirming without a plan", async () => {
        const user = userEvent.setup();
        renderPage();
        await waitFor(() =>
            expect(screen.getByRole("button", { name: /confirmar/i })).toBeInTheDocument()
        );
        await user.click(screen.getByRole("button", { name: /confirmar/i }));
        await waitFor(() =>
            expect(screen.getByText("Selecione um plano.")).toBeInTheDocument()
        );
    });

    it("shows warning when confirming without date", async () => {
        const user = userEvent.setup();
        renderPage();
        await waitFor(() =>
            expect(screen.getByText("Essencial")).toBeInTheDocument()
        );
        await user.click(screen.getByText("Essencial"));
        await user.click(screen.getByRole("button", { name: /confirmar/i }));
        await waitFor(() =>
            expect(screen.getByText("Selecione a data do evento.")).toBeInTheDocument()
        );
    });

    it("shows warning when confirming without start time", async () => {
        const { container } = renderPage();
        const user = userEvent.setup();
        await waitFor(() =>
            expect(screen.getByText("Essencial")).toBeInTheDocument()
        );
        await user.click(screen.getByText("Essencial"));
        fillDateTime(container, { date: "2027-06-15", start: "", end: "" });
        await user.click(screen.getByRole("button", { name: /confirmar/i }));
        await waitFor(() =>
            expect(screen.getByText("Selecione o horário de início.")).toBeInTheDocument()
        );
    });

    it("shows warning when confirming without end time", async () => {
        const { container } = renderPage();
        const user = userEvent.setup();
        await waitFor(() =>
            expect(screen.getByText("Essencial")).toBeInTheDocument()
        );
        await user.click(screen.getByText("Essencial"));
        fillDateTime(container, { date: "2027-06-15", start: "10:00", end: "" });
        await user.click(screen.getByRole("button", { name: /confirmar/i }));
        await waitFor(() =>
            expect(screen.getByText("Selecione o horário de término.")).toBeInTheDocument()
        );
    });

    it("shows warning when end time is before start time on confirm", async () => {
        const { container } = renderPage();
        const user = userEvent.setup();
        await waitFor(() =>
            expect(screen.getByText("Essencial")).toBeInTheDocument()
        );
        await user.click(screen.getByText("Essencial"));
        fillDateTime(container, { date: "2027-06-15", start: "18:00", end: "10:00" });
        await user.click(screen.getByRole("button", { name: /confirmar/i }));
        await waitFor(() =>
            expect(screen.getByText(/horário de término deve ser posterior/i)).toBeInTheDocument()
        );
    });

    it("shows warning when contract is not accepted", async () => {
        const { container } = renderPage();
        const user = userEvent.setup();
        await waitFor(() =>
            expect(screen.getByText("Essencial")).toBeInTheDocument()
        );
        await user.click(screen.getByText("Essencial"));
        fillDateTime(container);
        await user.click(screen.getByRole("button", { name: /confirmar/i }));
        await waitFor(() =>
            expect(screen.getByText("Aceite o contrato para continuar.")).toBeInTheDocument()
        );
    });

    it("creates reservation and navigates to checkout on success", async () => {
        const { container } = renderPage();
        const user = userEvent.setup();
        await waitFor(() =>
            expect(screen.getByText("Essencial")).toBeInTheDocument()
        );
        await user.click(screen.getByText("Essencial"));
        fillDateTime(container);
        await user.click(screen.getByLabelText(/li e estou de acordo/i));
        await user.click(screen.getByRole("button", { name: /confirmar/i }));

        await waitFor(() =>
            expect(screen.getByText("Checkout Page")).toBeInTheDocument()
        );
    });

    it("shows error toast when reservation creation fails", async () => {
        server.use(
            http.post(`${BASE}/reservations`, () =>
                HttpResponse.json(
                    { success: false, message: "Erro ao confirmar a reserva." },
                    { status: 422 }
                )
            )
        );
        const { container } = renderPage();
        const user = userEvent.setup();
        await waitFor(() =>
            expect(screen.getByText("Essencial")).toBeInTheDocument()
        );
        await user.click(screen.getByText("Essencial"));
        fillDateTime(container);
        await user.click(screen.getByLabelText(/li e estou de acordo/i));
        await user.click(screen.getByRole("button", { name: /confirmar/i }));

        await waitFor(() =>
            expect(screen.getByText(/erro ao confirmar a reserva/i)).toBeInTheDocument()
        );
    });

    it("renders kids area card when hasKidsArea is true", async () => {
        server.use(
            http.get(`${BASE}/venues/:id`, () =>
                HttpResponse.json({
                    success: true,
                    data: { ...mockVenue, hasKidsArea: true },
                })
            )
        );
        renderPage();
        await waitFor(() =>
            expect(screen.getByText(/área kids com monitor/i)).toBeInTheDocument()
        );
    });

    it("shows kidsMonitorExtraHours in summary when > 0", async () => {
        server.use(
            http.get(`${BASE}/venues/:id`, () =>
                HttpResponse.json({
                    success: true,
                    data: { ...mockVenue, hasKidsArea: true },
                })
            )
        );
        const user = userEvent.setup();
        renderPage();
        await waitFor(() =>
            expect(screen.getByRole("spinbutton")).toBeInTheDocument()
        );
        const kidsInput = screen.getByRole("spinbutton");
        await user.clear(kidsInput);
        await user.type(kidsInput, "2");
        await waitFor(() =>
            expect(screen.getByText("2h")).toBeInTheDocument()
        );
    });

    it("renders contract link", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getByRole("link", { name: /visualizar contrato/i })).toBeInTheDocument()
        );
    });

    it("confirm button is enabled when page loads", async () => {
        renderPage();
        await waitFor(() =>
            expect(screen.getByRole("button", { name: /confirmar/i })).toBeInTheDocument()
        );
        expect(screen.getByRole("button", { name: /confirmar/i })).not.toBeDisabled();
    });
});
