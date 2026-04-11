import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";
import { listMyGrants } from "../../services/promotion";
import * as S from "./styles";

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

const STATUS_MAP = {
    PENDING: { label: "Pendente", color: "amber" },
    PAID: { label: "Pago", color: "green" },
    CANCELLED: { label: "Cancelado", color: "red" },
    EXPIRED: { label: "Expirado", color: "gray" },
};

export default function Home() {
    const [dashboard, setDashboard] = useState({
        user: null,
        venues: [],
        reservations: [],
        grants: [],
    });

    const [isLoading, setIsLoading] = useState(true);
    const { key: locationKey } = useLocation();

    useEffect(() => {
        async function loadDashboard() {
            try {
                setIsLoading(true);

                const [userResponse, venuesResponse, reservationsResponse, grantsData] = await Promise.all([
                    api.get("/users/me"),
                    api.get("/venues"),
                    api.get("/reservations"),
                    listMyGrants().catch(() => []),
                ]);

                setDashboard({
                    user: userResponse.data.data,
                    venues: venuesResponse.data.data || [],
                    reservations: reservationsResponse.data.data || [],
                    grants: grantsData || [],
                });
            } catch {
                toast.error("Erro ao carregar os dados da Home.");
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboard();
    }, [locationKey]);

    const upcomingReservations = useMemo(() => {
        return dashboard.reservations
            .filter((r) => new Date(r.startDate) > new Date())
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }, [dashboard.reservations]);

    const userName = dashboard.user?.name?.split(" ")[0] || "Usuário";

    if (isLoading) {
        return (
            <S.Container>
                <S.LoadingState>
                    <S.Spinner />
                    <p>Carregando seu painel...</p>
                </S.LoadingState>
            </S.Container>
        );
    }

    return (
        <S.Container>
            <S.PageHeader>
                <S.HeaderLeft>
                    <S.Greeting>
                        {getGreeting()}, <span>{userName}</span>.
                    </S.Greeting>
                    <S.Subgreeting>
                        Aqui está um resumo da sua conta no Recanto Vila Rica.
                    </S.Subgreeting>
                </S.HeaderLeft>

                <S.NewReservationButton as={Link} to="/venues">
                    Nova reserva
                </S.NewReservationButton>
            </S.PageHeader>

            <S.StatsGrid>
                <S.StatCard $accent="#2563eb">
                    <S.StatLabel>Total de reservas</S.StatLabel>
                    <S.StatNumber $accent="#2563eb">
                        {dashboard.reservations.length}
                    </S.StatNumber>
                    <S.StatDescription>
                        Reservas vinculadas à sua conta
                    </S.StatDescription>
                </S.StatCard>

                <S.StatCard $accent="#7c3aed">
                    <S.StatLabel>Espaços disponíveis</S.StatLabel>
                    <S.StatNumber $accent="#7c3aed">
                        {dashboard.venues.length}
                    </S.StatNumber>
                    <S.StatDescription>
                        Ambientes para locação e eventos
                    </S.StatDescription>
                </S.StatCard>

                <S.StatCard $accent="#ea580c">
                    <S.StatLabel>Próximas reservas</S.StatLabel>
                    <S.StatNumber $accent="#ea580c">
                        {upcomingReservations.length}
                    </S.StatNumber>
                    <S.StatDescription>
                        Eventos agendados para os próximos dias
                    </S.StatDescription>
                </S.StatCard>
            </S.StatsGrid>

            <S.ActionRow>
                <S.ActionCard as={Link} to="/venues" $primary>
                    <S.ActionContent>
                        <S.ActionTitle>Reservar um espaço</S.ActionTitle>
                        <S.ActionDesc>
                            Escolha o local ideal e configure seu evento
                        </S.ActionDesc>
                    </S.ActionContent>
                    <S.ActionArrow $primary>›</S.ActionArrow>
                </S.ActionCard>

                <S.ActionCard as={Link} to="/reservations">
                    <S.ActionContent>
                        <S.ActionTitle>Minhas reservas</S.ActionTitle>
                        <S.ActionDesc>
                            Acompanhe e gerencie suas reservas ativas
                        </S.ActionDesc>
                    </S.ActionContent>
                    <S.ActionArrow>›</S.ActionArrow>
                </S.ActionCard>
            </S.ActionRow>

            <S.ContentGrid>
                <S.Panel>
                    <S.PanelHeader>
                        <S.PanelTitle>Próximas reservas</S.PanelTitle>
                        <S.PanelLink as={Link} to="/reservations">
                            Ver todas
                        </S.PanelLink>
                    </S.PanelHeader>

                    {upcomingReservations.length === 0 ? (
                        <S.EmptyState>
                            <S.EmptyDot />
                            <span>Nenhuma reserva futura encontrada.</span>
                        </S.EmptyState>
                    ) : (
                        <S.List>
                            {upcomingReservations.slice(0, 5).map((r) => {
                                const status = STATUS_MAP[r.status] ?? { label: r.status, color: "gray" };
                                return (
                                    <S.ListItem key={r.id}>
                                        <S.ListItemMain>
                                            <S.ListItemTitle>
                                                {r.venue?.name || "Reserva"}
                                            </S.ListItemTitle>
                                            <S.ListItemSub>
                                                {formatDate(r.startDate)}
                                            </S.ListItemSub>
                                        </S.ListItemMain>
                                        <S.StatusChip $color={status.color}>
                                            {status.label}
                                        </S.StatusChip>
                                    </S.ListItem>
                                );
                            })}
                        </S.List>
                    )}
                </S.Panel>

                <S.Panel>
                    <S.PanelHeader>
                        <S.PanelTitle>Espaços disponíveis</S.PanelTitle>
                        <S.PanelLink as={Link} to="/venues">
                            Ver todos
                        </S.PanelLink>
                    </S.PanelHeader>

                    {dashboard.venues.length === 0 ? (
                        <S.EmptyState>
                            <S.EmptyDot />
                            <span>Nenhum espaço encontrado.</span>
                        </S.EmptyState>
                    ) : (
                        <S.List>
                            {dashboard.venues.slice(0, 5).map((v) => (
                                <S.ListItem key={v.id}>
                                    <S.ListItemMain>
                                        <S.ListItemTitle>{v.name}</S.ListItemTitle>
                                        <S.ListItemSub>
                                            {v.location || "Localização não informada"}
                                        </S.ListItemSub>
                                    </S.ListItemMain>
                                    {v.basePrice != null && (
                                        <S.PriceChip>
                                            A partir de {formatCurrency(v.basePrice)}
                                        </S.PriceChip>
                                    )}
                                </S.ListItem>
                            ))}
                        </S.List>
                    )}
                </S.Panel>
            </S.ContentGrid>

            {dashboard.grants.length > 0 && (
                <S.Panel>
                    <S.PanelHeader>
                        <S.PanelTitle>Seus descontos disponíveis</S.PanelTitle>
                        <S.PanelLink as={Link} to="/referrals">
                            Ver indicações
                        </S.PanelLink>
                    </S.PanelHeader>

                    <S.List>
                        {dashboard.grants.map((grant) => (
                            <S.ListItem key={grant.id}>
                                <S.ListItemMain>
                                    <S.ListItemTitle>{grant.campaign?.name}</S.ListItemTitle>
                                    <S.ListItemSub>
                                        {grant.validUntil
                                            ? `Válido até ${formatDate(grant.validUntil)}`
                                            : "Sem data de expiração"}
                                    </S.ListItemSub>
                                </S.ListItemMain>
                                <S.DiscountChip>{grant.percentOff}% OFF</S.DiscountChip>
                            </S.ListItem>
                        ))}
                    </S.List>
                </S.Panel>
            )}
        </S.Container>
    );
}
