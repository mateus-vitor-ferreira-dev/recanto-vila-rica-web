import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Logo from "../../assets/logo-recanto-vila-rica.png";
import api from "../../services/api";
import * as S from "./styles";

export default function Home() {
    const [dashboard, setDashboard] = useState({
        user: null,
        venues: [],
        reservations: [],
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadDashboard() {
            try {
                setIsLoading(true);

                const [userResponse, venuesResponse, reservationsResponse] = await Promise.all([
                    api.get("/users/me"),
                    api.get("/venues"),
                    api.get("/reservations"),
                ]);

                setDashboard({
                    user: userResponse.data.data,
                    venues: venuesResponse.data.data || [],
                    reservations: reservationsResponse.data.data || [],
                });
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error?.message ||
                    "Erro ao carregar os dados da Home.";

                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        }

        loadDashboard();
    }, []);

    const upcomingReservations = useMemo(() => {
        return dashboard.reservations.filter((reservation) => {
            return new Date(reservation.startDate) > new Date();
        });
    }, [dashboard.reservations]);

    const userName = dashboard.user?.name || "Usuário";

    if (isLoading) {
        return (
            <S.Container>
                <S.LoadingCard>
                    <h2>Carregando dashboard...</h2>
                    <p>Buscando informações da sua conta, reservas e espaços.</p>
                </S.LoadingCard>
            </S.Container>
        );
    }

    return (
        <S.Container>
            <S.HeroSection>
                <S.HeroTop>
                    <S.HeroLogo src={Logo} alt="Logo Recanto Vila Rica" />
                    <S.Badge>Bem-vindo ao sistema</S.Badge>
                </S.HeroTop>

                <S.Title>
                    Olá, <span>{userName}</span>
                </S.Title>

                <S.Description>
                    Gerencie reservas, visualize espaços disponíveis e acompanhe as principais
                    informações do Recanto Vila Rica em um só lugar.
                </S.Description>
            </S.HeroSection>

            <S.CardsGrid>
                <S.Card>
                    <S.CardTitle>Reservas</S.CardTitle>
                    <S.CardValue>{dashboard.reservations.length}</S.CardValue>
                    <S.CardText>
                        Total de reservas vinculadas à sua conta.
                    </S.CardText>
                </S.Card>

                <S.Card>
                    <S.CardTitle>Espaços disponíveis</S.CardTitle>
                    <S.CardValue>{dashboard.venues.length}</S.CardValue>
                    <S.CardText>
                        Ambientes cadastrados para locação e eventos.
                    </S.CardText>
                </S.Card>

                <S.Card>
                    <S.CardTitle>Próximas reservas</S.CardTitle>
                    <S.CardValue>{upcomingReservations.length}</S.CardValue>
                    <S.CardText>
                        Reservas futuras encontradas para os próximos períodos.
                    </S.CardText>
                </S.Card>
            </S.CardsGrid>

            <S.ContentGrid>
                <S.Panel>
                    <S.PanelTitle>Minhas próximas reservas</S.PanelTitle>

                    {upcomingReservations.length === 0 ? (
                        <S.EmptyText>Você ainda não possui reservas futuras.</S.EmptyText>
                    ) : (
                        <S.List>
                            {upcomingReservations.slice(0, 5).map((reservation) => (
                                <li key={reservation.id}>
                                    <strong>
                                        {new Date(reservation.startDate).toLocaleDateString("pt-BR")}
                                    </strong>{" "}
                                    — status: {reservation.status}
                                </li>
                            ))}
                        </S.List>
                    )}
                </S.Panel>

                <S.Panel>
                    <S.PanelTitle>Espaços cadastrados</S.PanelTitle>

                    {dashboard.venues.length === 0 ? (
                        <S.EmptyText>Nenhum espaço encontrado.</S.EmptyText>
                    ) : (
                        <S.List>
                            {dashboard.venues.slice(0, 5).map((venue) => (
                                <li key={venue.id}>
                                    <strong>{venue.name}</strong>
                                    {venue.location ? ` — ${venue.location}` : ""}
                                </li>
                            ))}
                        </S.List>
                    )}
                </S.Panel>
            </S.ContentGrid>
        </S.Container>
    );
}