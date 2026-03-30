import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/cadastro" />} />
            <Route path="/cadastro" element={<SignUp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
        </Routes>
    );
}   