import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGSAP } from "@gsap/react";

import { Input } from "../../components";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { formatPhone } from "../../utils/formatPhone";
import { animateFadeInUp, animateStagger } from "../../utils/animations";
import * as S from "./styles";

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return (first + last).toUpperCase();
}

/**
 * Página de perfil do usuário autenticado.
 *
 * Permite editar nome, e-mail, telefone e data de nascimento.
 * Também oferece seção de alteração de senha (campos separados com confirmação).
 *
 * @see GET /users/me
 * @see PATCH /users/me
 * @component
 */
export default function Profile() {
    const navigate = useNavigate();
    const { updateUser } = useAuth();
    const containerRef = useRef(null);

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        birthDate: "",
    });

    const [passwordForm, setPasswordForm] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        async function loadUser() {
            try {
                setIsLoading(true);
                const { data } = await api.get("/users/me", { signal });

                if (signal.aborted) return;

                const u = data.data;
                setUser(u);
                setForm({
                    name: u.name || "",
                    email: u.email || "",
                    phone: formatPhone(u.phone || ""),
                    birthDate: u.birthDate ? u.birthDate.split("T")[0] : "",
                });
            } catch (error) {
                if (error?.name === "CanceledError" || error?.name === "AbortError") return;
                const status = error.response?.status;
                if (status === 401 || status === 403) return navigate("/home");
                if (status === 429) {
                    toast.error("Muitas requisições em pouco tempo. Aguarde alguns instantes e tente novamente.");
                    return;
                }
                toast.error(getErrorMessage(error, "Erro ao carregar os dados do perfil."));
            } finally {
                if (!signal.aborted) setIsLoading(false);
            }
        }

        loadUser();

        return () => controller.abort();
    }, [navigate]);

    function handleChange(e) {
        const value = e.target.name === "phone"
            ? formatPhone(e.target.value)
            : e.target.value;
        setForm((prev) => ({ ...prev, [e.target.name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.name.trim()) {
            return toast.error("O nome é obrigatório.");
        }

        if (!form.email.trim()) {
            return toast.error("O e-mail é obrigatório.");
        }

        try {
            setIsSaving(true);

            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.replace(/\D/g, "") || undefined,
                birthDate: form.birthDate || undefined,
            };

            const { data } = await api.patch(`/users/${user.id}`, payload);

            const updated = data.data;

            updateUser({ name: updated.name, email: updated.email });

            setUser(updated);
            toast.success("Perfil atualizado com sucesso.");
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao atualizar o perfil."));
        } finally {
            setIsSaving(false);
        }
    }

    async function handlePasswordSubmit(e) {
        e.preventDefault();

        if (passwordForm.newPassword.length < 8) {
            return toast.error("A senha deve ter ao menos 8 caracteres.");
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            return toast.error("As senhas não coincidem.");
        }

        try {
            setIsChangingPassword(true);
            await api.patch(`/users/${user.id}`, { password: passwordForm.newPassword });
            toast.success("Senha alterada com sucesso.");
            setPasswordForm({ newPassword: "", confirmPassword: "" });
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao alterar a senha."));
        } finally {
            setIsChangingPassword(false);
        }
    }

    useGSAP(() => {
        if (isLoading || !containerRef.current) return;
        const el = containerRef.current;
        animateFadeInUp(el.querySelector(".anim-header"));
        animateStagger(el.querySelectorAll(".anim-card"), { delay: 0.15 });
    }, { scope: containerRef, dependencies: [isLoading] });

    if (isLoading) {
        return (
            <S.Container>
                <S.LoadingState>
                    <S.Spinner />
                    <p>Carregando perfil...</p>
                </S.LoadingState>
            </S.Container>
        );
    }

    return (
        <S.Container ref={containerRef}>
            <S.PageHeader className="anim-header">
                <S.HeaderLeft>
                    <S.PageTitle>Meu perfil</S.PageTitle>
                    <S.PageSubtitle>Gerencie suas informações pessoais e de acesso.</S.PageSubtitle>
                </S.HeaderLeft>
            </S.PageHeader>

            <S.Layout>
                <S.IdentityCard className="anim-card">
                    <S.AvatarLarge>{getInitials(user?.name)}</S.AvatarLarge>
                    <S.IdentityName>{user?.name}</S.IdentityName>
                    <S.IdentityEmail>{user?.email}</S.IdentityEmail>
                    <S.RoleBadge>{user?.role === "ADMIN" ? "Administrador" : "Usuário"}</S.RoleBadge>
                </S.IdentityCard>

                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    <S.FormCard className="anim-card" onSubmit={handleSubmit}>
                        <S.SectionTitle>Informações pessoais</S.SectionTitle>

                        <S.FieldGrid>
                            <Input
                                label="Nome completo"
                                name="name"
                                placeholder="Seu nome"
                                value={form.name}
                                onChange={handleChange}
                            />

                            <Input
                                label="E-mail"
                                name="email"
                                type="email"
                                placeholder="seu@email.com"
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
                                label="Data de nascimento"
                                name="birthDate"
                                type="date"
                                value={form.birthDate}
                                onChange={handleChange}
                            />
                        </S.FieldGrid>

                        <S.FormFooter>
                            <S.CancelButton type="button" onClick={() => navigate("/home")}>
                                Cancelar
                            </S.CancelButton>
                            <S.SaveButton type="submit" disabled={isSaving}>
                                {isSaving ? "Salvando..." : "Salvar alterações"}
                            </S.SaveButton>
                        </S.FormFooter>
                    </S.FormCard>

                    <S.FormCard className="anim-card" as="form" onSubmit={handlePasswordSubmit}>
                        <S.SectionTitle>Alterar senha</S.SectionTitle>

                        <S.FieldGrid>
                            <Input
                                label="Nova senha"
                                name="newPassword"
                                type="password"
                                placeholder="Mín. 8 caracteres"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                            />

                            <Input
                                label="Confirmar nova senha"
                                name="confirmPassword"
                                type="password"
                                placeholder="Repita a nova senha"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                            />
                        </S.FieldGrid>

                        <S.FormFooter>
                            <S.SaveButton type="submit" disabled={isChangingPassword}>
                                {isChangingPassword ? "Alterando..." : "Alterar senha"}
                            </S.SaveButton>
                        </S.FormFooter>
                    </S.FormCard>
                </div>
            </S.Layout>
        </S.Container>
    );
}
