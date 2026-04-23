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

    it("redirects '/' to '/cadastro'", () => {
        renderRoutes("/");
        expect(screen.getByRole("button", { name: /criar conta/i })).toBeInTheDocument();
    });

    it("renders SignUp at /cadastro", () => {
        renderRoutes("/cadastro");
        expect(screen.getByRole("button", { name: /criar conta/i })).toBeInTheDocument();
    });

    it("renders Login at /login", () => {
        renderRoutes("/login");
        expect(screen.getByRole("button", { name: /^entrar$/i })).toBeInTheDocument();
    });

    it("redirects unauthenticated user to /login from /home", () => {
        renderRoutes("/home");
        expect(screen.getByRole("button", { name: /^entrar$/i })).toBeInTheDocument();
    });

    it("renders Home for authenticated user at /home", async () => {
        localStorage.setItem(
            "recanto:userData",
            JSON.stringify({ token: "t", user: { id: "u-1", role: "USER" } })
        );
        renderRoutes("/home");
        expect(screen.getByText(/carregando seu painel/i)).toBeInTheDocument();
    });

    it("redirects non-admin from /admin to /home", async () => {
        localStorage.setItem(
            "recanto:userData",
            JSON.stringify({ token: "t", user: { id: "u-1", role: "USER" } })
        );
        renderRoutes("/admin");
        expect(screen.getByText(/carregando seu painel/i)).toBeInTheDocument();
    });
});
