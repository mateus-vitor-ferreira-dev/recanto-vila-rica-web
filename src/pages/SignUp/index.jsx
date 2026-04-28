import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthLayout, Button, DatePickerInput, GoogleButton, Input } from "../../components";

import api from "../../services/api";
import { formatPhone } from "../../utils/formatPhone";
import { validatePassword } from "../../utils/validatePassword";
import * as S from "./styles";

/**
 * Página de cadastro de novo usuário.
 *
 * Formata o telefone em tempo real com `formatPhone`. Após o cadastro bem-sucedido,
 * persiste os dados no `localStorage` e redireciona para `/home`.
 *
 * @see POST /users
 * @component
 * @param {object} props
 * @param {boolean} [props.introFinished=true] - Repassado para `AuthLayout` para controlar visibilidade do logo
 */
export default function SignUp({ introFinished = true }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
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

    async function handleSubmit(event) {
        event.preventDefault();

        if (!form.firstName.trim()) {
            return toast.error("Informe seu nome.");
        }

        if (!form.lastName.trim()) {
            return toast.error("Informe seu sobrenome.");
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
                name: `${form.firstName.trim()} ${form.lastName.trim()}`,
                email: form.email,
                phone: form.phone.replace(/\D/g, ""),
                password: form.password,
                birthDate: form.birthDate,
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
                <S.NameRow>
                    <Input
                        label="Nome"
                        name="firstName"
                        placeholder="Seu nome"
                        value={form.firstName}
                        onChange={handleChange}
                    />
                    <Input
                        label="Sobrenome"
                        name="lastName"
                        placeholder="Seu sobrenome"
                        value={form.lastName}
                        onChange={handleChange}
                    />
                </S.NameRow>

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

                <DatePickerInput
                    label="Data de nascimento"
                    name="birthDate"
                    value={form.birthDate}
                    onChange={handleChange}
                    maxDate={new Date().toISOString().split("T")[0]}
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