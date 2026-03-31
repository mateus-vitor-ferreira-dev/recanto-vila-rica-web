import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthLayout, Button, GoogleButton, Input } from "../../components";

import api from "../../services/api";
import * as S from "./styles";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!form.email || !form.password) {
            return toast.error("Informe e-mail e senha.");
        }

        try {
            const { data } = await api.post("/auth/login", form);

            localStorage.setItem("recanto:userData", JSON.stringify(data.data));

            toast.success(data.message || "Login realizado com sucesso.");
            navigate("/home");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error?.message ||
                "Erro ao fazer login.";
            toast.error(message);
        }
    }

    return (
        <AuthLayout
            title="Entrar"
            subtitle="Acesse sua conta para continuar."
        >
            <S.Form onSubmit={handleSubmit}>
                <Input
                    label="E-mail"
                    name="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={form.email}
                    onChange={handleChange}
                />

                <Input
                    label="Senha"
                    name="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={form.password}
                    onChange={handleChange}
                />

                <Button type="submit">Entrar</Button>

                <GoogleButton
                    text="Entrar com Google"
                    navigate={navigate}
                />

                <S.FooterText>
                    Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
                </S.FooterText>
            </S.Form>
        </AuthLayout>
    );
}