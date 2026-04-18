import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGSAP } from "@gsap/react";

import { cancelReservation, listReservations } from "../../services/reservation";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { PLAN_LABELS, formatDate, formatTime, formatCurrency, calcDuration } from "../../utils/reservationFormat";
import { animateFadeInUp, animateStagger } from "../../utils/animations";
import * as S from "./styles";

const STATUS_MAP = {
    PENDING: { label: "Pendente", color: "amber" },
    PAID: { label: "Pago", color: "green" },
    CANCELLED: { label: "Cancelado", color: "red" },
    EXPIRED: { label: "Expirado", color: "gray" },
};

export default function Reservations() {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [confirmCancelId, setConfirmCancelId] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                setIsLoading(true);
                const data = await listReservations(controller.signal);
                setReservations(data);
            } catch (error) {
                if (error.name !== "CanceledError" && error.name !== "AbortError") {
                    toast.error(getErrorMessage(error, "Erro ao carregar reservas."));
                }
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        }

        load();

        return () => controller.abort();
    }, []);

    useGSAP(() => {
        if (isLoading || !reservations.length) return;
        const el = containerRef.current;
        if (!el) return;
        animateFadeInUp(el.querySelector(".anim-header"));
        animateStagger(el.querySelectorAll(".anim-card"), { delay: 0.15 });
    }, { scope: containerRef, dependencies: [isLoading, reservations.length] });

    async function handleCancelReservation() {
        const id = confirmCancelId;
        setConfirmCancelId(null);
        try {
            setCancellingId(id);
            await cancelReservation(id);
            toast.success("Reserva cancelada com sucesso.");
            const data = await listReservations();
            setReservations(data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao cancelar reserva."));
        } finally {
            setCancellingId(null);
        }
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
                    <S.PayButton as={Link} to="/venues">Fazer uma reserva</S.PayButton>
                </S.EmptyState>
            </S.Container>
        );
    }

    return (
        <S.Container ref={containerRef}>
            {confirmCancelId && (
                <S.ModalOverlay>
                    <S.ModalBox>
                        <S.ModalTitle>Cancelar reserva</S.ModalTitle>
                        <S.ModalBody>
                            Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita.
                        </S.ModalBody>
                        <S.ModalActions>
                            <S.ModalCancelBtn onClick={() => setConfirmCancelId(null)}>
                                Voltar
                            </S.ModalCancelBtn>
                            <S.ModalConfirmBtn
                                onClick={handleCancelReservation}
                                disabled={cancellingId !== null}
                            >
                                {cancellingId ? "Cancelando..." : "Sim, cancelar"}
                            </S.ModalConfirmBtn>
                        </S.ModalActions>
                    </S.ModalBox>
                </S.ModalOverlay>
            )}

            <S.Header className="anim-header">
                <S.Title>Minhas reservas</S.Title>
                <S.Description>
                    Acompanhe o status das suas reservas e gerencie seus eventos.
                </S.Description>
            </S.Header>

            <S.List>
                {reservations.map((reservation) => {
                    const status = STATUS_MAP[reservation.status] ?? { label: reservation.status, color: "gray" };
                    const duration = calcDuration(reservation.startDate, reservation.endDate);

                    return (
                        <S.Card className="anim-card" key={reservation.id}>
                            <S.CardHeader>
                                <div>
                                    <strong>{reservation.venue?.name || "Salão"}</strong>
                                    <span>
                                        {formatDate(reservation.startDate)} •{" "}
                                        {formatTime(reservation.startDate)}
                                    </span>
                                </div>

                                <S.Status status={reservation.status}>
                                    {status.label}
                                </S.Status>
                            </S.CardHeader>

                            <S.CardBody>
                                <div>
                                    <span>Plano</span>
                                    <strong>
                                        {PLAN_LABELS[reservation.planCode] || reservation.planCode || "—"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Duração</span>
                                    <strong>{duration} hora{duration !== 1 ? "s" : ""}</strong>
                                </div>

                                <div>
                                    <span>Valor</span>
                                    <strong>{formatCurrency(reservation.totalPrice)}</strong>
                                </div>
                            </S.CardBody>

                            <S.CardFooter>
                                {reservation.status === "PENDING" && (
                                    <>
                                        <S.PayButton
                                            onClick={() => navigate(`/checkout/${reservation.id}`)}
                                        >
                                            Ir para pagamento
                                        </S.PayButton>

                                        <S.CancelButton
                                            onClick={() => setConfirmCancelId(reservation.id)}
                                            disabled={cancellingId === reservation.id}
                                        >
                                            {cancellingId === reservation.id ? "Cancelando..." : "Cancelar reserva"}
                                        </S.CancelButton>
                                    </>
                                )}
                            </S.CardFooter>
                        </S.Card>
                    );
                })}
            </S.List>
        </S.Container>
    );
}
