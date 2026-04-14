import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import ReservationIntent from "../../pages/ReservationIntent";
import { server } from "../mocks/server";

function renderPage() {
    return render(
        <MemoryRouter initialEntries={["/reservation-intent/venue-1"]}>
            <Routes>
                <Route
                    path="/reservation-intent/:venueId"
                    element={<ReservationIntent />}
                />
            </Routes>
        </MemoryRouter>
    );
}

describe("ReservationIntent extra coverage", () => {
    it("does not show kids extra hours when value is zero", async () => {
        server.use(
            http.get("*", ({ request }) => {
                if (request.url.includes("/venues")) {
                    return HttpResponse.json({
                        success: true,
                        data: {
                            id: "venue-1",
                            name: "Salão Principal",
                            description: "Salão principal para eventos e reservas",
                            capacity: 0,
                            location: "",
                            basePricePerHour: 65000,
                            hasKidsArea: true,
                            kidsAreaPricePerHour: 30,
                            hasPool: false,
                        },
                    });
                }
            })
        );

        renderPage();

        const saloes = await screen.findAllByText(/salão principal/i);
        expect(saloes.length).toBeGreaterThan(0);

        expect(
            screen.queryByText(/monitor infantil/i)
        ).not.toBeInTheDocument();
    });

    it("renders correctly and avoids loading state", async () => {
        server.use(
            http.get("*", ({ request }) => {
                if (request.url.includes("/venues")) {
                    return HttpResponse.json({
                        success: true,
                        data: {
                            id: "venue-1",
                            name: "Salão Principal",
                            description: "Salão principal para eventos e reservas",
                            capacity: 0,
                            location: "",
                            basePricePerHour: 65000,
                            hasKidsArea: true,
                            kidsAreaPricePerHour: 30,
                            hasPool: false,
                        },
                    });
                }
            })
        );

        renderPage();

        const saloes = await screen.findAllByText(/salão principal/i);
        expect(saloes.length).toBeGreaterThan(0);
    });

    it("does not render kids area card when venue has no kids area", async () => {
        server.use(
            http.get("*", ({ request }) => {
                if (request.url.includes("/venues")) {
                    return HttpResponse.json({
                        success: true,
                        data: {
                            id: "venue-1",
                            name: "Salão Principal",
                            description: "Salão principal para eventos e reservas",
                            capacity: 0,
                            location: "",
                            basePricePerHour: 65000,
                            hasKidsArea: false,
                            hasPool: false,
                        },
                    });
                }
            })
        );

        renderPage();

        const saloes = await screen.findAllByText(/salão principal/i);
        expect(saloes.length).toBeGreaterThan(0);

        expect(
            screen.queryByText(/área kids com monitor/i)
        ).not.toBeInTheDocument();
    });
    
});