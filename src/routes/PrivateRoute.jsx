/**
 * @module routes/PrivateRoute
 * @description Guard de rota que exige autenticação.
 * Redireciona para `/login` se não houver dados de sessão no `localStorage`.
 */
import { Navigate, Outlet } from "react-router-dom";

/**
 * Rota protegida — exige que o usuário esteja autenticado.
 * Verifica a presença de `recanto:userData` no `localStorage`.
 *
 * @component
 */
export function PrivateRoute() {
    const userData = localStorage.getItem("recanto:userData");

    if (!userData) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}