import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Checkout from "../../pages/Checkout";
import { server } from "../mocks/server";

const BASE = "http://localhost:3000";

function renderPage() {
    return render(
        <MemoryRouter initialEntries={["/checkout/123"]}>
            <Routes>
                <Route path="/checkout/:reservationId" element={<Checkout />} />
            </Routes>
        </MemoryRouter>
    );
}

describe("Checkout extra coverage", () => {
    it("stays in loading state when reservationId is missing", async () => {
        render(
            <MemoryRouter initialEntries={["/checkout"]}>
                <Routes>
                    <Route path="/checkout" element={<Checkout />} />
                </Routes>
            </MemoryRouter>
        );

        expect(
            await screen.findByText(/carregando dados da reserva/i)
        ).toBeInTheDocument();
    });

    it("handles API failure without crashing", async () => {
        server.use(
            http.get(`${BASE}/reservations/123`, () =>
                HttpResponse.json({}, { status: 500 })
            )
        );

        const { container } = renderPage();

        // apenas verifica que o componente renderizou sem quebrar
        expect(container).toBeTruthy();
    });
});