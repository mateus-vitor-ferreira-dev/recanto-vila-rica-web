/**
 * @module routes/AdminRoute
 * @description Guard de rota que exige `role === "ADMIN"`.
 * Redireciona para `/home` quando o usuário não tem permissão de administrador.
 */
import { Navigate, Outlet } from "react-router-dom";

/**
 * Rota protegida — exige `role === "ADMIN"` na sessão do `localStorage`.
 * Deve ser aninhada dentro de `PrivateRoute` para garantir que o usuário
 * também esteja autenticado.
 *
 * @component
 */
export function AdminRoute() {
    const raw = localStorage.getItem("recanto:userData");
    const userData = raw ? JSON.parse(raw) : null;

    if (userData?.user?.role !== "ADMIN") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
