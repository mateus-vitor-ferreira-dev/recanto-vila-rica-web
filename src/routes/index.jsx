import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../components";
import {
    Admin,
    Home,
    Login,
    ReservationIntent,
    Reservations,
    SignUp,
    Venues,
} from "../pages";
import { PrivateRoute } from "./PrivateRoute";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/cadastro" replace />} />
            <Route path="/cadastro" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/venues" element={<Venues />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route path="/reservation-intent/:venueId" element={<ReservationIntent />} />
                    <Route path="/admin" element={<Admin />} />
                </Route>
            </Route>
        </Routes>
    );
}