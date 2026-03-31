import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import api from "../../services/api";
import * as S from "./styles";

export default function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function loadReservations() {
        try {
            setIsLoading(true);

            const { data } = await api.get("/reservations");

            setReservations(data.data);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error?.message ||
                "Erro ao carregar reservas.";

            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadReservations();
    }, []);

    async function handleCancelReservation(id) {
        try {
            await api.patch(`/reservations/${id}/cancel`);

            toast.success("Reserva cancelada com sucesso.");
            loadReservations();
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error?.message ||
                "Erro ao cancelar reserva.";

            toast.error(message);
        }
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString("pt-BR");
    }

    function formatTime(date) {
        return new Date(date).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    function formatCurrency(value) {
        return Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    function getStatusLabel(status) {
        const map = {
            PENDING: "Pendente",
            PAID: "Pago",
            CANCELLED: "Cancelado",
        };

        return map[status] || status;
    }

    if (isLoading) {
        return (
            <S.Container>
                <S.LoadingCard>
                    <h2>Carregando reservas...</h2>
                    <p>Aguarde enquanto buscamos suas reservas.</p>
                </S.LoadingCard>
            </S.Container>
        );
    }

    if (!reservations.length) {
        return (
            <S.Container>
                <S.EmptyState>
                    <h2>Nenhuma reserva encontrada</h2>
                    <p>Você ainda não possui reservas cadastradas.</p>
                </S.EmptyState>
            </S.Container>
        );
    }

    return (
        <S.Container>
            <S.Header>
                <S.Title>Minhas reservas</S.Title>
                <S.Description>
                    Acompanhe o status das suas reservas e gerencie seus eventos.
                </S.Description>
            </S.Header>

            <S.List>
                {reservations.map((reservation) => (
                    <S.Card key={reservation.id}>
                        <S.CardHeader>
                            <div>
                                <strong>{reservation.venue?.name || "Salão"}</strong>
                                <span>
                                    {formatDate(reservation.startDate)} •{" "}
                                    {formatTime(reservation.startDate)}
                                </span>
                            </div>

                            <S.Status status={reservation.status}>
                                {getStatusLabel(reservation.status)}
                            </S.Status>
                        </S.CardHeader>

                        <S.CardBody>
                            <div>
                                <span>Duração</span>
                                <strong>
                                    {Math.abs(
                                        new Date(reservation.endDate).getHours() -
                                        new Date(reservation.startDate).getHours()
                                    )}{" "}
                                    horas
                                </strong>
                            </div>

                            <div>
                                <span>Valor</span>
                                <strong>{formatCurrency(reservation.totalPrice)}</strong>
                            </div>
                        </S.CardBody>

                        <S.CardFooter>
                            {reservation.status === "PENDING" && (
                                <S.CancelButton
                                    onClick={() => handleCancelReservation(reservation.id)}
                                >
                                    Cancelar reserva
                                </S.CancelButton>
                            )}
                        </S.CardFooter>
                    </S.Card>
                ))}
            </S.List>
        </S.Container>
    );
}