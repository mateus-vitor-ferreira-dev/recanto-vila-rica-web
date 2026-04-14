import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthLayout, Button, GoogleButton, Input } from "../../components";

import api from "../../services/api";
import { formatPhone } from "../../utils/formatPhone";
import * as S from "./styles";

export default function SignUp({ introFinished = true }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        birthDate: "",
    });

    function handleChange(event) {
        const value =
            event.target.name === "phone"
                ? formatPhone(event.target.value)
                : event.target.value;

        setForm({ ...form, [event.target.name]: value });
    }

    function validatePassword(password) {
        if (password.length < 8) {
            return "A senha deve ter pelo menos 8 caracteres.";
        }

        if (!/[A-Z]/.test(password)) {
            return "A senha deve conter pelo menos 1 letra maiúscula.";
        }

        if (!/[0-9]/.test(password)) {
            return "A senha deve conter pelo menos 1 número.";
        }

        if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;']/.test(password)) {
            return "A senha deve conter pelo menos 1 caractere especial.";
        }

        return null;
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!form.name) {
            return toast.error("Informe seu nome.");
        }

        if (!form.email) {
            return toast.error("Informe seu e-mail.");
        }

        if (!form.phone) {
            return toast.error("Informe seu telefone.");
        }

        if (!form.password) {
            return toast.error("Informe sua senha.");
        }

        if (!form.birthDate) {
            return toast.error("Informe sua data de nascimento.");
        }

        const passwordError = validatePassword(form.password);

        if (passwordError) {
            return toast.error(passwordError);
        }

        try {
            await api.post("/users", {
                ...form,
                phone: form.phone.replace(/\D/g, ""),
            });

            toast.success("Cadastro realizado com sucesso.");
            navigate("/login");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error?.message ||
                "Erro ao cadastrar usuário.";

            toast.error(message);
        }
    }

    return (
        <AuthLayout
            title="Criar conta"
            subtitle="Preencha os dados para acessar a plataforma."
            introFinished={introFinished}
        >
            <S.Form onSubmit={handleSubmit}>
                <Input
                    label="Nome"
                    name="name"
                    placeholder="Digite seu nome"
                    value={form.name}
                    onChange={handleChange}
                />

                <Input
                    label="E-mail"
                    name="email"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={form.email}
                    onChange={handleChange}
                />

                <Input
                    label="Telefone"
                    name="phone"
                    placeholder="(11) 99999-9999"
                    inputMode="tel"
                    value={form.phone}
                    onChange={handleChange}
                    prefix="🇧🇷"
                />

                <Input
                    label="Senha"
                    name="password"
                    type="password"
                    placeholder="Digite sua senha"
                    value={form.password}
                    onChange={handleChange}
                    showPasswordToggle
                />

                <Input
                    label="Data de nascimento"
                    name="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={handleChange}
                />

                <Button type="submit">Criar conta</Button>

                <S.Divider>
                    <span>ou continue com</span>
                </S.Divider>

                <GoogleButton navigate={navigate} />

                <S.FooterText>
                    Já tem conta? <Link to="/login">Entrar</Link>
                </S.FooterText>
            </S.Form>
        </AuthLayout>
    );
}