import { render, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it } from "vitest";
import Checkout from "../../pages/Checkout";
import { server } from "../mocks/server";

describe("Checkout debug", () => {
    it("debug what renders", async () => {
        server.use(
            http.get("http://localhost:3000/reservations/res-1", () =>
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
            )
        );

        const { container } = render(
            <MemoryRouter initialEntries={["/checkout/res-1"]}>
                <Routes>
                    <Route path="/checkout/:reservationId" element={<Checkout />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {}, { timeout: 3000 });
        console.log("DOM:", container.innerHTML.substring(0, 500));
    });
});
