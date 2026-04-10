import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import Header from "../../components/Header";

function renderHeader(userData = null, path = "/home") {
    if (userData) {
        localStorage.setItem("recanto:userData", JSON.stringify(userData));
    } else {
        localStorage.removeItem("recanto:userData");
    }

    return render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route path="*" element={<Header />} />
            </Routes>
            <div id="pages">
                <Routes>
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </div>
        </MemoryRouter>
    );
}

describe("Header component", () => {
    afterEach(() => localStorage.clear());

    it("renders nav links", () => {
        renderHeader({ user: { name: "Mateus", role: "USER" } });
        expect(screen.getByRole("link", { name: /início/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /espaços/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /reservas/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /indicações/i })).toBeInTheDocument();
    });

    it("shows Admin link only for ADMIN role", () => {
        renderHeader({ user: { name: "Admin", role: "ADMIN" } });
        expect(screen.getByRole("link", { name: /^admin$/i })).toBeInTheDocument();
    });

    it("does not show Admin link for USER role", () => {
        renderHeader({ user: { name: "Mateus", role: "USER" } });
        expect(screen.queryByRole("link", { name: /^admin$/i })).not.toBeInTheDocument();
    });

    it("shows user initials in avatar", () => {
        renderHeader({ user: { name: "Mateus Ferreira", role: "USER" } });
        expect(screen.getByText("MF")).toBeInTheDocument();
    });

    it("falls back to Usuário when name is empty", () => {
        renderHeader({ user: { name: "", role: "USER" } });
        expect(screen.getByText("Usuário")).toBeInTheDocument();
    });

    it("shows single initial when name has only one word", () => {
        renderHeader({ user: { name: "Mateus", role: "USER" } });
        expect(screen.getByText("M")).toBeInTheDocument();
    });

    it("falls back to userData.name when user object is absent", () => {
        renderHeader({ name: "Mateus", role: "USER" });
        expect(screen.getByText(/mateus/i)).toBeInTheDocument();
    });

    it("shows Usuário when no userData is in localStorage", () => {
        renderHeader(null);
        expect(screen.getByText("Usuário")).toBeInTheDocument();
    });

    it("removes userData and redirects on logout", async () => {
        renderHeader({ user: { name: "Mateus", role: "USER" }, token: "tk" });
        const user = userEvent.setup();
        await user.click(screen.getByRole("button", { name: /sair/i }));
        expect(localStorage.getItem("recanto:userData")).toBeNull();
    });
});
