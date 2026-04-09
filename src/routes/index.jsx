import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../components";
import {
    Admin,
    Checkout,
    Home,
    Login,
    PaymentCancel,
    PaymentSuccess,
    Profile,
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
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/checkout/:reservationId" element={<Checkout />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/cancel" element={<PaymentCancel />} />
                    <Route path="/admin" element={<Admin />} />
                </Route>
            </Route>
        </Routes>
    );
}