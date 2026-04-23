/**
 * @module contexts/AuthContext
 * @description Contexto de autenticação global. Provê dados do usuário, token
 * e helpers para login, logout e atualização de perfil sem acesso direto ao
 * localStorage nas páginas consumidoras.
 */
import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "recanto:userData";

function readStorage() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
        return null;
    }
}

function normalizeUser(session) {
    if (!session) return null;
    return {
        id: session.user?.id ?? session.id,
        name: session.user?.name ?? session.name,
        email: session.user?.email ?? session.email,
        role: session.user?.role ?? session.role,
        emailVerified: session.user?.emailVerified ?? session.emailVerified ?? true,
    };
}

/**
 * Provedor de autenticação — deve envolver toda a aplicação (abaixo de `ThemeProvider`).
 * Inicializa o estado a partir do `localStorage` na montagem.
 *
 * @component
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
    const [session, setSession] = useState(readStorage);

    const user = normalizeUser(session);
    const token = session?.token ?? null;
    const isAuthenticated = !!session;

    function login(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSession(data);
    }

    function logout() {
        localStorage.removeItem(STORAGE_KEY);
        setSession(null);
    }

    function updateUser(updated) {
        const stored = readStorage();
        if (!stored) return;
        if (stored.user) {
            stored.user = { ...stored.user, ...updated };
        } else {
            Object.assign(stored, updated);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        setSession({ ...stored });
    }

    const value = useMemo(
        () => ({ user, token, isAuthenticated, login, logout, updateUser }),
        [session], // eslint-disable-line react-hooks/exhaustive-deps
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook de acesso ao contexto de autenticação.
 *
 * @returns {{ user: object|null, token: string|null, isAuthenticated: boolean, login: Function, logout: Function, updateUser: Function }}
 */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
