import { Navigate, Outlet } from "react-router-dom";

export function AdminRoute() {
    const raw = localStorage.getItem("recanto:userData");
    const userData = raw ? JSON.parse(raw) : null;

    if (userData?.user?.role !== "ADMIN") {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
