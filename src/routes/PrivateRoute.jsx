import { Navigate, Outlet } from "react-router-dom";

export function PrivateRoute() {
    const userData = localStorage.getItem("recanto:userData");

    if (!userData) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}