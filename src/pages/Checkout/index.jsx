import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { getReservation } from "../../services/reservation";
import { createCheckoutSession } from "../../services/payment";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { PLAN_LABELS, formatDateFull, formatTime, formatCurrency, calcDuration } from "../../utils/reservationFormat";
import * as S from "./styles";

export default function Checkout() {
    const { reservationId } = useParams();
    const navigate = useNavigate();

    const [reservation, setReservation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRedirecting, setIsRedirecting] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function loadReservation() {
            try {
                setIsLoading(true);
                const data = await getReservation(reservationId, controller.signal);
                setReservation(data);
            } catch (error) {
                if (error?.name === "CanceledError" || error?.name === "AbortError") return;
                toast.error(getErrorMessage(error, "Erro ao carregar a reserva."));
                navigate("/reservations");
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        }

        if (reservationId) {
            loadReservation();
        }

        return () => controller.abort();
    }, [reservationId, navigate]);

    async function handleProceedToPayment() {
        try {
            setIsRedirecting(true);

            if (reservation.checkoutUrl) {
                window.location.href = reservation.checkoutUrl;
                return;
            }

            const session = await createCheckoutSession(reservationId);
            window.location.href = session.url;
        } catch (error) {
            const status = error.response?.status;

            if (status === 409) {
                toast.error("Já existe uma sessão de pagamento ativa para esta reserva. Verifique seu e-mail ou aguarde a expiração.");
            } else {
                toast.error(getErrorMessage(error, "Erro ao iniciar o pagamento."));
            }

            setIsRedirecting(false);
        }
    }

    if (isLoading) {
        return (
            <S.Container>
                <S.LoadingState>
                    <S.Spinner />
                    <p>Carregando dados da reserva...</p>
                </S.LoadingState>
            </S.Container>
        );
    }

    if (!reservation) {
        return null;
    }

    const isPendingPayment = reservation.status === "PENDING";
    const duration = calcDuration(reservation.startDate, reservation.endDate);

    return (
        <S.Container>
            <S.PageHeader>
                <S.PageTitle>Finalizar pagamento</S.PageTitle>
                <S.PageDescription>
                    Revise os detalhes da sua reserva antes de prosseguir para o pagamento seguro.
                </S.PageDescription>
            </S.PageHeader>

            <S.Grid>
                <S.SummaryCard>
                    <S.SummaryHeader>
                        <S.VenueName>{reservation.venue?.name}</S.VenueName>
                        <S.StatusBadge status={reservation.status}>
                            {reservation.status === "PENDING" ? "Aguardando pagamento" : reservation.status}
                        </S.StatusBadge>
                    </S.SummaryHeader>

                    <S.Divider />

                    <S.DetailList>
                        {reservation.planCode && (
                            <S.DetailItem>
                                <S.DetailLabel>Plano</S.DetailLabel>
                                <S.DetailValue>{PLAN_LABELS[reservation.planCode] || reservation.planCode}</S.DetailValue>
                            </S.DetailItem>
                        )}

                        <S.DetailItem>
                            <S.DetailLabel>Data do evento</S.DetailLabel>
                            <S.DetailValue>{formatDateFull(reservation.startDate)}</S.DetailValue>
                        </S.DetailItem>

                        <S.DetailItem>
                            <S.DetailLabel>Início</S.DetailLabel>
                            <S.DetailValue>{formatTime(reservation.startDate)}</S.DetailValue>
                        </S.DetailItem>

                        <S.DetailItem>
                            <S.DetailLabel>Término</S.DetailLabel>
                            <S.DetailValue>{formatTime(reservation.endDate)}</S.DetailValue>
                        </S.DetailItem>

                        <S.DetailItem>
                            <S.DetailLabel>Duração</S.DetailLabel>
                            <S.DetailValue>{duration} hora{duration !== 1 ? "s" : ""}</S.DetailValue>
                        </S.DetailItem>
                    </S.DetailList>

                    <S.Divider />

                    <S.TotalRow>
                        <S.TotalLabel>Total a pagar</S.TotalLabel>
                        <S.TotalValue>{formatCurrency(reservation.totalPrice)}</S.TotalValue>
                    </S.TotalRow>
                </S.SummaryCard>

                <S.PaymentCard>
                    <S.PaymentTitle>Pagamento seguro</S.PaymentTitle>
                    <S.PaymentDescription>
                        Você será redirecionado para o ambiente seguro do Stripe para concluir o pagamento.
                    </S.PaymentDescription>

                    <S.SecurityBadges>
                        <S.SecurityItem>
                            <S.SecurityDot />
                            Criptografia SSL de ponta a ponta
                        </S.SecurityItem>

                        <S.SecurityItem>
                            <S.SecurityDot />
                            Processado por Stripe
                        </S.SecurityItem>

                        <S.SecurityItem>
                            <S.SecurityDot />
                            Dados do cartão não armazenados
                        </S.SecurityItem>
                    </S.SecurityBadges>

                    <S.AmountSummary>
                        <span>Total</span>
                        <strong>{formatCurrency(reservation.totalPrice)}</strong>
                    </S.AmountSummary>

                    {isPendingPayment ? (
                        <S.PayButton
                            onClick={handleProceedToPayment}
                            disabled={isRedirecting}
                        >
                            {isRedirecting ? "Redirecionando..." : "Ir para o pagamento"}
                        </S.PayButton>
                    ) : (
                        <S.InfoBox>
                            Esta reserva não está disponível para pagamento (status: {reservation.status}).
                        </S.InfoBox>
                    )}

                    <S.CancelLink onClick={() => navigate("/reservations")}>
                        Voltar para minhas reservas
                    </S.CancelLink>

                    <S.StripeBadge>
                        Pagamento processado por <strong>Stripe</strong>
                    </S.StripeBadge>
                </S.PaymentCard>
            </S.Grid>
        </S.Container>
    );
}
