import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import { createReservation, quoteReservation } from "../../services/reservation";
import { getVenue } from "../../services/venue";
import { getErrorMessage } from "../../utils/getErrorMessage";
import * as S from "./styles";

const PLANS = [
    {
        code: "PROMOCIONAL",
        label: "Promocional",
        days: "Segunda a Quinta",
        priceCents: 65000,
    },
    {
        code: "ESSENCIAL",
        label: "Essencial",
        days: "Sexta a Domingo e feriados",
        priceCents: 85000,
    },
    {
        code: "COMPLETA",
        label: "Completa",
        days: "Sexta a Domingo e feriados",
        priceCents: 100000,
    },
];

function formatCurrency(cents) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(cents / 100);
}

export default function ReservationIntent() {
    const { venueId } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [planCode, setPlanCode] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [kidsMonitorExtraHours, setKidsMonitorExtraHours] = useState(0);
    const [notes, setNotes] = useState("");
    const [acceptedContract, setAcceptedContract] = useState(false);

    const [quote, setQuote] = useState(null);
    const [quoteLoading, setQuoteLoading] = useState(false);

    const quoteTimerRef = useRef(null);

    useEffect(() => {
        async function loadVenue() {
            try {
                setLoading(true);
                const data = await getVenue(venueId);
                setVenue(data);
            } catch (error) {
                toast.error(getErrorMessage(error, "Erro ao carregar os dados do salão."));
            } finally {
                setLoading(false);
            }
        }

        if (venueId) {
            loadVenue();
        }
    }, [venueId]);

    useEffect(() => {
        if (!planCode || !eventDate || !startTime || !endTime) {
            setQuote(null);
            return;
        }

        clearTimeout(quoteTimerRef.current);
        quoteTimerRef.current = setTimeout(async () => {
            try {
                setQuoteLoading(true);
                const startDate = new Date(`${eventDate}T${startTime}:00`);
                const endDate = new Date(`${eventDate}T${endTime}:00`);

                if (endDate <= startDate) {
                    setQuote(null);
                    return;
                }

                const payload = {
                    venueId,
                    planCode,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    ...(kidsMonitorExtraHours > 0 && { kidsMonitorExtraHours }),
                };

                const result = await quoteReservation(payload);
                setQuote(result);
            } catch {
                setQuote(null);
            } finally {
                setQuoteLoading(false);
            }
        }, 600);

        return () => clearTimeout(quoteTimerRef.current);
    }, [planCode, eventDate, startTime, endTime, kidsMonitorExtraHours, venueId]);

    const today = new Date().toISOString().split("T")[0];

    function handleOpenRoutes() {
        if (!venue?.location) {
            toast.info("Endereço do salão não disponível.");
            return;
        }
        const encodedAddress = encodeURIComponent(venue.location);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, "_blank");
    }

    async function handleConfirmReservation() {
        if (!planCode) {
            toast.warning("Selecione um plano.");
            return;
        }
        if (!eventDate) {
            toast.warning("Selecione a data do evento.");
            return;
        }
        if (!startTime) {
            toast.warning("Selecione o horário de início.");
            return;
        }
        if (!endTime) {
            toast.warning("Selecione o horário de término.");
            return;
        }

        const startDate = new Date(`${eventDate}T${startTime}:00`);
        const endDate = new Date(`${eventDate}T${endTime}:00`);

        if (endDate <= startDate) {
            toast.warning("O horário de término deve ser posterior ao de início.");
            return;
        }

        if (!acceptedContract) {
            toast.warning("Aceite o contrato para continuar.");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                venueId,
                planCode,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                ...(notes.trim() && { notes: notes.trim() }),
                ...(kidsMonitorExtraHours > 0 && { kidsMonitorExtraHours }),
            };

            const reservation = await createReservation(payload);

            toast.success("Reserva criada com sucesso! Redirecionando para o pagamento...");
            navigate(`/checkout/${reservation.id}`);
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao confirmar a reserva."));
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <S.Container>
                <S.Content>
                    <S.PageTitle>Intenção de reserva</S.PageTitle>
                    <S.PageDescription>Carregando dados do salão...</S.PageDescription>
                </S.Content>
            </S.Container>
        );
    }

    if (!venue) {
        return (
            <S.Container>
                <S.Content>
                    <S.PageTitle>Intenção de reserva</S.PageTitle>
                    <S.PageDescription>Salão não encontrado.</S.PageDescription>
                </S.Content>
            </S.Container>
        );
    }

    const selectedPlan = PLANS.find((p) => p.code === planCode);

    return (
        <S.Container>
            <S.Content>
                <S.TopSection>
                    <div>
                        <S.PageTitle>Intenção de reserva</S.PageTitle>
                        <S.PageDescription>
                            Selecione um plano, escolha a data e horário e veja o valor da sua reserva.
                        </S.PageDescription>
                    </div>

                    <S.EstimatedCard>
                        <span>Valor estimado</span>
                        <strong>
                            {quoteLoading
                                ? "Calculando..."
                                : quote
                                ? formatCurrency(quote.totalCents)
                                : selectedPlan
                                ? formatCurrency(selectedPlan.priceCents)
                                : "—"}
                        </strong>
                        <small>{selectedPlan ? selectedPlan.label : "Selecione um plano"}</small>
                    </S.EstimatedCard>
                </S.TopSection>

                <S.Grid>
                    <S.LeftColumn>
                        <S.Card>
                            <S.CardTitle>{venue.name}</S.CardTitle>
                            <S.CardDescription>
                                {venue.description || "Salão principal para eventos e reservas"}
                            </S.CardDescription>

                            <S.InfoGrid>
                                <S.InfoBox>
                                    <span>Capacidade</span>
                                    <strong>{venue.capacity || 0} pessoas</strong>
                                </S.InfoBox>

                                <S.InfoBox>
                                    <span>Localização</span>
                                    <strong>{venue.location || "Endereço não informado"}</strong>
                                </S.InfoBox>
                            </S.InfoGrid>

                            <S.RouteButton type="button" onClick={handleOpenRoutes}>
                                Rotas
                            </S.RouteButton>
                        </S.Card>

                        <S.Card>
                            <S.CardTitle>Escolha o plano</S.CardTitle>
                            <S.CardDescription>
                                Cada plano determina os dias disponíveis e o valor da reserva.
                            </S.CardDescription>

                            <S.PlanGrid>
                                {PLANS.map((plan) => (
                                    <S.PlanCard
                                        key={plan.code}
                                        $selected={planCode === plan.code}
                                        onClick={() => setPlanCode(plan.code)}
                                    >
                                        <S.PlanLabel>{plan.label}</S.PlanLabel>
                                        <S.PlanDays>{plan.days}</S.PlanDays>
                                        <S.PlanPrice>{formatCurrency(plan.priceCents)}</S.PlanPrice>
                                    </S.PlanCard>
                                ))}
                            </S.PlanGrid>
                        </S.Card>

                        <S.Card>
                            <S.CardTitle>Data e horário</S.CardTitle>
                            <S.CardDescription>
                                Escolha a data do evento e os horários de início e término.
                            </S.CardDescription>

                            <S.FormRow>
                                <Input
                                    label="Data do evento"
                                    type="date"
                                    min={today}
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                />

                                <Input
                                    label="Início"
                                    type="time"
                                    min="08:00"
                                    max="22:00"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />

                                <Input
                                    label="Término"
                                    type="time"
                                    min="08:00"
                                    max="23:59"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </S.FormRow>
                        </S.Card>

                        {venue.hasKidsArea && (
                            <S.Card>
                                <S.CardTitle>Área Kids com monitor</S.CardTitle>
                                <S.CardDescription>
                                    Adicione horas extras de monitor para a área kids.
                                </S.CardDescription>

                                <S.OptionItem>
                                    <div>
                                        <strong>Horas extras de monitor</strong>
                                        <span>Incluso no plano — horas adicionais têm custo extra</span>
                                    </div>
                                    <S.KidsInput
                                        type="number"
                                        min="0"
                                        max="12"
                                        value={kidsMonitorExtraHours}
                                        onChange={(e) =>
                                            setKidsMonitorExtraHours(Math.max(0, Number(e.target.value)))
                                        }
                                    />
                                </S.OptionItem>
                            </S.Card>
                        )}

                        <S.Card>
                            <S.CardTitle>Observações</S.CardTitle>
                            <S.CardDescription>
                                Informe qualquer detalhe adicional para a sua reserva (opcional).
                            </S.CardDescription>
                            <S.NotesField
                                placeholder="Ex: festa infantil, decoração temática..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={3}
                            />
                        </S.Card>
                    </S.LeftColumn>

                    <S.RightColumn>
                        <S.Card>
                            <S.CardTitle>Resumo da reserva</S.CardTitle>

                            <S.SummaryList>
                                <S.SummaryItem>
                                    <span>Salão</span>
                                    <strong>{venue.name}</strong>
                                </S.SummaryItem>

                                <S.SummaryItem>
                                    <span>Plano</span>
                                    <strong>{selectedPlan?.label || "Não selecionado"}</strong>
                                </S.SummaryItem>

                                <S.SummaryItem>
                                    <span>Data</span>
                                    <strong>{eventDate || "Não selecionada"}</strong>
                                </S.SummaryItem>

                                <S.SummaryItem>
                                    <span>Início</span>
                                    <strong>{startTime || "—"}</strong>
                                </S.SummaryItem>

                                <S.SummaryItem>
                                    <span>Término</span>
                                    <strong>{endTime || "—"}</strong>
                                </S.SummaryItem>

                                {kidsMonitorExtraHours > 0 && (
                                    <S.SummaryItem>
                                        <span>Monitor kids extra</span>
                                        <strong>{kidsMonitorExtraHours}h</strong>
                                    </S.SummaryItem>
                                )}
                            </S.SummaryList>

                            <S.Divider />

                            {quoteLoading && (
                                <S.QuoteLoading>Calculando cotação...</S.QuoteLoading>
                            )}

                            {quote && !quoteLoading && (
                                <>
                                    {quote.items?.map((item, i) => (
                                        <S.SummaryItem key={i}>
                                            <span>{item.description || item.label}</span>
                                            <strong>{formatCurrency(item.amountCents ?? item.totalCents ?? 0)}</strong>
                                        </S.SummaryItem>
                                    ))}

                                    {quote.discountApplied && (
                                        <>
                                            <S.SummaryItem>
                                                <span>Subtotal</span>
                                                <strong>{formatCurrency(quote.subtotalCents)}</strong>
                                            </S.SummaryItem>
                                            <S.DiscountItem>
                                                <span>Desconto</span>
                                                <strong>- {formatCurrency(quote.discountCents)}</strong>
                                            </S.DiscountItem>
                                        </>
                                    )}

                                    <S.TotalRow>
                                        <span>Total</span>
                                        <strong>{formatCurrency(quote.totalCents)}</strong>
                                    </S.TotalRow>
                                </>
                            )}

                            {!quote && !quoteLoading && selectedPlan && (
                                <S.TotalRow>
                                    <span>Valor base do plano</span>
                                    <strong>{formatCurrency(selectedPlan.priceCents)}</strong>
                                </S.TotalRow>
                            )}
                        </S.Card>

                        <S.ActionCard>
                            <S.ConfirmButton
                                type="button"
                                onClick={handleConfirmReservation}
                                disabled={submitting}
                            >
                                {submitting ? "Confirmando reserva..." : "Confirmar e ir para pagamento"}
                            </S.ConfirmButton>

                            <S.ContractCard>
                                <S.ContractTitle>Contrato da reserva</S.ContractTitle>
                                <S.ContractDescription>
                                    Leia o contrato com atenção antes de prosseguir com a confirmação da reserva.
                                </S.ContractDescription>

                                <S.ContractLink
                                    href="/documents/contrato-recanto-vila-rica.pdf"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Visualizar contrato em PDF
                                </S.ContractLink>

                                <S.ContractCheckboxWrapper>
                                    <input
                                        type="checkbox"
                                        id="acceptedContract"
                                        checked={acceptedContract}
                                        onChange={(e) => setAcceptedContract(e.target.checked)}
                                    />
                                    <label htmlFor="acceptedContract">
                                        Li e estou de acordo com os termos do contrato.
                                    </label>
                                </S.ContractCheckboxWrapper>
                            </S.ContractCard>
                        </S.ActionCard>
                    </S.RightColumn>
                </S.Grid>
            </S.Content>
        </S.Container>
    );
}
