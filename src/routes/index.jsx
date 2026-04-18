import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../components";
import {
    Admin,
    Checkout,
    ContactUs,
    Home,
    Login,
    NegotiationChat,
    Negotiations,
    PaymentCancel,
    PaymentSuccess,
    Profile,
    Referrals,
    ReservationIntent,
    Reservations,
    SignUp,
    Venues,
} from "../pages";
import { AdminRoute } from "./AdminRoute";
import { PrivateRoute } from "./PrivateRoute";

export function AppRoutes({ introFinished }) {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/cadastro" replace />} />
            <Route
                path="/cadastro"
                element={<SignUp introFinished={introFinished} />}
            />
            <Route
                path="/login"
                element={<Login introFinished={introFinished} />}
            />

            <Route element={<PrivateRoute />}>
                <Route element={<MainLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/venues" element={<Venues />} />
                    <Route path="/reservations" element={<Reservations />} />
                    <Route
                        path="/reservation-intent/:venueId"
                        element={<ReservationIntent />}
                    />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/referrals" element={<Referrals />} />
                    <Route path="/contate-nos" element={<ContactUs />} />
                    <Route path="/negociacoes" element={<Negotiations />} />
                    <Route path="/negociacoes/:id" element={<NegotiationChat />} />
                    <Route path="/checkout/:reservationId" element={<Checkout />} />
                    <Route path="/payment/success" element={<PaymentSuccess />} />
                    <Route path="/payment/cancel" element={<PaymentCancel />} />
                    <Route element={<AdminRoute />}>
                        <Route path="/admin" element={<Admin />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}