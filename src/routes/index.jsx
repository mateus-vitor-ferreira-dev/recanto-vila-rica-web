import { Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../components";
import {
    Admin,
    Checkout,
    ContactUs,
    ForgotPassword,
    Home,
    Login,
    NegotiationChat,
    Promotions,
    Negotiations,
    PaymentCancel,
    PaymentSuccess,
    Profile,
    Referrals,
    ReservationIntent,
    Reservations,
    ResetPassword,
    SignUp,
    Venues,
} from "../pages";
import { AdminRoute } from "./AdminRoute";
import { PrivateRoute } from "./PrivateRoute";

/**
 * Árvore de rotas da aplicação.
 *
 * Estrutura:
 * - `/` → redireciona para `/cadastro`
 * - `/cadastro` e `/login` — públicas (passam `introFinished` para controlar IntroAnimation)
 * - Restante — protegidas por `PrivateRoute` + `MainLayout`
 *   - `/admin` — protegida adicionalmente por `AdminRoute`
 *
 * @component
 * @param {object} props
 * @param {boolean} props.introFinished - Repassado para Login/SignUp para controlar visibilidade do logo
 */
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
            <Route path="/esqueci-senha" element={<ForgotPassword />} />
            <Route path="/redefinir-senha" element={<ResetPassword />} />

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
                    <Route path="/promocoes" element={<Promotions />} />
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