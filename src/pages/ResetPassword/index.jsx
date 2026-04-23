/**
 * Página de redefinição de senha.
 *
 * Lê o `token` da query string (`?token=`). Se o token estiver ausente, exibe
 * mensagem de erro. Após redefinir com sucesso, redireciona para `/login`.
 *
 * @see POST /auth/reset-password
 * @component
 * @param {object} props
 * @param {boolean} [props.introFinished=true] - Repassado para `AuthLayout`
 */
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthLayout, Button, Input } from "../../components";
import { resetPassword } from "../../services/auth";
import * as S from "./styles";

export default function ResetPassword({ introFinished = true }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [form, setForm] = useState({ password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.password || !form.confirmPassword) {
            return toast.error("Preencha os dois campos.");
        }

        if (form.password !== form.confirmPassword) {
            return toast.error("As senhas não coincidem.");
        }

        try {
            setLoading(true);
            await resetPassword(token, form.password);
            toast.success("Senha redefinida com sucesso! Faça login.");
            navigate("/login");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Token inválido ou expirado. Solicite um novo link.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    if (!token) {
        return (
            <AuthLayout
                title="Link inválido"
                subtitle="O link de redefinição de senha é inválido ou expirou."
                introFinished={introFinished}
            >
                <S.Form>
                    <S.ErrorBox>
                        Este link não é válido. Solicite um novo link de redefinição
                        na página de login.
                    </S.ErrorBox>
                    <S.FooterText>
                        <Link to="/login">Voltar para o login</Link>
                    </S.FooterText>
                </S.Form>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Redefinir senha"
            subtitle="Crie uma nova senha para sua conta."
            introFinished={introFinished}
        >
            <S.Form onSubmit={handleSubmit}>
                <Input
                    label="Nova senha"
                    name="password"
                    placeholder="Mín. 8 caracteres, maiúscula, número e especial"
                    value={form.password}
                    onChange={handleChange}
                    showPasswordToggle
                />

                <Input
                    label="Confirmar nova senha"
                    name="confirmPassword"
                    placeholder="Repita a nova senha"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    showPasswordToggle
                />

                <Button type="submit" disabled={loading}>
                    {loading ? "Redefinindo..." : "Redefinir senha"}
                </Button>

                <S.FooterText>
                    <Link to="/login">Voltar para o login</Link>
                </S.FooterText>
            </S.Form>
        </AuthLayout>
    );
}
