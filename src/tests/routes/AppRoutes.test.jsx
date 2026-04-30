import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { AuthProvider } from "../../contexts/AuthContext";
import { ThemeProvider } from "../../contexts/ThemeContext";
import { AppRoutes } from "../../routes";

function renderRoutes(initialPath = "/") {
    return render(
        <ThemeProvider>
            <AuthProvider>
                <MemoryRouter initialEntries={[initialPath]}>
                    <AppRoutes />
                </MemoryRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

describe("AppRoutes", () => {
    afterEach(() => localStorage.clear());

    it("redirects '/' to '/cadastro'", async () => {
        renderRoutes("/");
        expect(await screen.findByRole("button", { name: /criar conta/i })).toBeInTheDocument();
    });

    it("renders SignUp at /cadastro", async () => {
        renderRoutes("/cadastro");
        expect(await screen.findByRole("button", { name: /criar conta/i })).toBeInTheDocument();
    });

    it("renders Login at /login", async () => {
        renderRoutes("/login");
        expect(await screen.findByRole("button", { name: /^entrar$/i })).toBeInTheDocument();
    });

    it("redirects unauthenticated user to /login from /home", async () => {
        renderRoutes("/home");
        expect(await screen.findByRole("button", { name: /^entrar$/i })).toBeInTheDocument();
    });

    it("renders Home for authenticated user at /home", async () => {
        localStorage.setItem(
            "recanto:userData",
            JSON.stringify({ token: "t", user: { id: "u-1", role: "USER" } })
        );
        renderRoutes("/home");
        expect(await screen.findByText(/carregando seu painel/i)).toBeInTheDocument();
    });

    it("redirects non-admin from /admin to /home", async () => {
        localStorage.setItem(
            "recanto:userData",
            JSON.stringify({ token: "t", user: { id: "u-1", role: "USER" } })
        );
        renderRoutes("/admin");
        expect(await screen.findByText(/carregando seu painel/i)).toBeInTheDocument();
    });
});
