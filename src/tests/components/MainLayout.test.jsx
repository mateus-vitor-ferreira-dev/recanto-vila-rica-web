import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MainLayout from "../../components/MainLayout";

describe("MainLayout", () => {
    it("renders header, outlet area and footer", () => {
        render(
            <MemoryRouter>
                <MainLayout />
            </MemoryRouter>
        );
        expect(screen.getAllByText(/recanto vila rica/i).length).toBeGreaterThan(0);
        expect(screen.getByText(/2026 Recanto Vila Rica/i)).toBeInTheDocument();
    });
});
