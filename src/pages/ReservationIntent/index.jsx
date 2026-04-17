import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ErrorBoundary from "../../components/ErrorBoundary";
import Input from "../../components/Input";
import { createReservation, quoteReservation } from "../../services/reservation";
import { getVenue } from "../../services/venue";
import { getErrorMessage } from "../../utils/getErrorMessage";
import * as S from "./styles";

const ContratoDownloadLink = lazy(() => import("../../components/ContratoRVR/DownloadLink"));

const PLANS = [
    {
        code: "PROMOCIONAL",
        label: "Promocional",
        days: "Segunda a Quinta (não feriados)",
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

const FIXED_HOLIDAYS = [
    "01-01",
    "04-21",
    "05-01",
    "09-07",
    "10-12",
    "11-02",
    "11-15",
    "11-20",
    "12-25",
];

const VARIABLE_HOLIDAYS = [
    "2025-03-03", "2025-03-04", "2025-04-18", "2025-06-19",
    "2026-02-16", "2026-02-17", "2026-04-03", "2026-06-04",
    "2027-02-08", "2027-02-09", "2027-03-26", "2027-05-20",
];

const INCLUDED_KIDS_HOURS_BY_PLAN = {
    PROMOCIONAL: 4,
    ESSENCIAL: 4,
    COMPLETA: 4,
};

function isHoliday(dateString) {
    if (!dateString) return false;
    if (VARIABLE_HOLIDAYS.includes(dateString)) return true;
    return FIXED_HOLIDAYS.includes(dateString.slice(5));
}

function isPlanAvailableForDate(planCode, eventDate) {
    if (!eventDate) return true;
    const dayOfWeek = new Date(`${eventDate}T12:00:00`).getDay();
    const holiday = isHoliday(eventDate);
    const isWeekendOrHoliday = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6 || holiday;

    if (planCode === "PROMOCIONAL") return !isWeekendOrHoliday;
    return isWeekendOrHoliday;
}

function getBlockedPlanMessage(planCode, eventDate) {
    const holiday = isHoliday(eventDate);
    const dayOfWeek = new Date(`${eventDate}T12:00:00`).getDay();
    const isWeekendOrHoliday = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6 || holiday;

    if (planCode === "PROMOCIONAL" && isWeekendOrHoliday) {
        return holiday
            ? "O plano Promocional não está disponível em feriados. Escolha o Essencial ou o Completa."
            : "O plano Promocional é disponível apenas de Segunda a Quinta. Escolha o Essencial ou o Completa para fins de semana.";
    }

    return "Este plano é disponível apenas de Segunda a Quinta (sem feriados). Escolha o Promocional para dias úteis.";
}

function formatCurrency(cents) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(Number(cents || 0) / 100);
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
    const [kidsMonitorHours, setKidsMonitorHours] = useState(0);
    const [notes, setNotes] = useState("");
    const [acceptedContract, setAcceptedContract] = useState(false);

    const [quote, setQuote] = useState(null);
    const [quoteLoading, setQuoteLoading] = useState(false);

    const quoteTimerRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadVenue() {
            try {
                setLoading(true);
                const data = await getVenue(venueId, controller.signal);
                setVenue(data);
            } catch (error) {
                if (error?.name === "CanceledError" || error?.name === "AbortError") return;
                toast.error(getErrorMessage(error, "Erro ao carregar os dados do salão."));
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        if (venueId) {
            loadVenue();
        }

        return () => controller.abort();
    }, [venueId]);

    useEffect(() => {
        if (!venue?.hasKidsArea) return;

        const includedHours = INCLUDED_KIDS_HOURS_BY_PLAN[planCode] ?? 0;

        setKidsMonitorHours((current) => {
            if (!planCode) return 0;
            return current < includedHours ? includedHours : current;
        });
    }, [planCode, venue?.hasKidsArea]);

    const minimumKidsHours = INCLUDED_KIDS_HOURS_BY_PLAN[planCode] ?? 0;
    const kidsMonitorExtraHours = Math.max(0, kidsMonitorHours - minimumKidsHours);

    useEffect(() => {
        if (!planCode || !eventDate || !startTime || !endTime) {
            setQuote(null);
            return;
        }

        const controller = new AbortController();

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

                const result = await quoteReservation(payload, controller.signal);

                if (!controller.signal.aborted) {
                    setQuote(result);
                }
            } catch (error) {
                if (error?.name === "CanceledError" || error?.name === "AbortError") return;

                if (!controller.signal.aborted) {
                    toast.error(getErrorMessage(error, "Erro ao calcular orçamento."));
                    setQuote(null);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setQuoteLoading(false);
                }
            }
        }, 600);

        return () => {
            clearTimeout(quoteTimerRef.current);
            controller.abort();
        };
    }, [planCode, eventDate, startTime, endTime, kidsMonitorExtraHours, venueId]);

    const today = new Date().toISOString().split("T")[0];

    function handlePlanClick(code) {
        if (eventDate && !isPlanAvailableForDate(code, eventDate)) {
            toast.warning(getBlockedPlanMessage(code, eventDate));
            return;
        }
        setPlanCode(code);
    }

    function handleDateChange(newDate) {
        setEventDate(newDate);

        if (planCode && !isPlanAvailableForDate(planCode, newDate)) {
            setPlanCode("");
            toast.info("A data alterada não é compatível com o plano anterior. Selecione uma modalidade.");
        }
    }

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

        if (!isPlanAvailableForDate(planCode, eventDate)) {
            toast.warning(getBlockedPlanMessage(planCode, eventDate));
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

    const normalizedQuote = (() => {
        if (!quote || planCode !== "COMPLETA") return quote;

        const targetBasePriceCents = 100000;
        const planBaseItem = quote.items?.find((item) => item.type === "PLAN_BASE");

        const currentBasePriceCents =
            planBaseItem?.totalAmountCents ??
            planBaseItem?.totalCents ??
            selectedPlan?.priceCents ??
            targetBasePriceCents;

        const diffCents = targetBasePriceCents - currentBasePriceCents;

        if (diffCents === 0) return quote;

        return {
            ...quote,
            items: (quote.items ?? []).map((item) =>
                item.type === "PLAN_BASE"
                    ? {
                        ...item,
                        unitAmountCents: targetBasePriceCents,
                        totalAmountCents: targetBasePriceCents,
                    }
                    : item
            ),
            subtotalCents: Number(quote.subtotalCents ?? 0) + diffCents,
            totalCents: Number(quote.totalCents ?? 0) + diffCents,
        };
    })();

    const planIsIncompatible = planCode && eventDate && !isPlanAvailableForDate(planCode, eventDate);

    const locatario = (() => {
        try {
            const stored = JSON.parse(localStorage.getItem("recanto:userData") || "{}");
            return stored?.user?.name || stored?.name || "";
        } catch {
            return "";
        }
    })();

    const comKids = Boolean(venue?.hasKidsArea);
    const comPiscina = planCode === "COMPLETA";

    const contratoProps = {
        locatario,
        data: eventDate
            ? new Date(`${eventDate}T00:00:00`).toLocaleDateString("pt-BR")
            : "a definir",
        horarioInicio: startTime || "—",
        horarioFim: endTime || "—",
        comKids,
        comPiscina,
        planCode: planCode || "ESSENCIAL",
        totalCents: normalizedQuote?.totalCents ?? selectedPlan?.priceCents ?? null,
    };

    return (
        <S.Container>
            <S.Content>
                <S.TopSection>
                    <div>
                        <S.PageTitle>Intenção de reserva</S.PageTitle>
                        <S.PageDescription>
                            Escolha a data do evento, selecione a modalidade disponível e veja o valor da sua reserva.
                        </S.PageDescription>
                    </div>

                    <S.EstimatedCard>
                        <span>Valor estimado</span>
                        <strong>
                            {quoteLoading
                                ? "Calculando..."
                                : normalizedQuote
                                    ? formatCurrency(normalizedQuote.totalCents)
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
                            <S.CardTitle>Data e horário</S.CardTitle>
                            <S.CardDescription>
                                Escolha a data do evento e os horários de início e término. As modalidades disponíveis dependem do dia selecionado.
                            </S.CardDescription>

                            <S.FormRow>
                                <Input
                                    id="eventDate"
                                    label="Data do evento"
                                    type="date"
                                    min={today}
                                    value={eventDate}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                />

                                <Input
                                    id="startTime"
                                    label="Início"
                                    type="time"
                                    min="08:00"
                                    max="22:00"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                />

                                <Input
                                    id="endTime"
                                    label="Término"
                                    type="time"
                                    min="08:00"
                                    max="23:59"
                                    value={endTime}
                                    onChange={(e) => setEndTime(e.target.value)}
                                />
                            </S.FormRow>
                        </S.Card>

                        <S.Card>
                            <S.CardTitle>Escolha a modalidade</S.CardTitle>
                            <S.CardDescription>
                                {eventDate
                                    ? "As modalidades disponíveis para a data selecionada estão habilitadas abaixo."
                                    : "Selecione uma data primeiro para ver as modalidades disponíveis."}
                            </S.CardDescription>

                            <S.PlanGrid>
                                {PLANS.map((plan) => {
                                    const available = isPlanAvailableForDate(plan.code, eventDate);

                                    return (
                                        <S.PlanCard
                                            key={plan.code}
                                            $selected={planCode === plan.code}
                                            $disabled={eventDate ? !available : false}
                                            onClick={() => handlePlanClick(plan.code)}
                                        >
                                            <S.PlanLabel>{plan.label}</S.PlanLabel>
                                            <S.PlanDays>{plan.days}</S.PlanDays>
                                            <S.PlanPrice>{formatCurrency(plan.priceCents)}</S.PlanPrice>
                                        </S.PlanCard>
                                    );
                                })}
                            </S.PlanGrid>
                        </S.Card>

                        {venue.hasKidsArea && (
                            <S.Card>
                                <S.CardTitle>Área Kids com monitor</S.CardTitle>
                                <S.CardDescription>
                                    O plano selecionado inclui 4 horas de monitor. Caso deseje mais tempo,
                                    cada hora adicional será cobrada à parte.
                                </S.CardDescription>

                                <S.OptionItem>
                                    <div>
                                        <strong>Horas do monitor</strong>
                                        <span>4h incluídas no plano. Horas adicionais: R$ 30,00/h</span>
                                    </div>

                                    <S.KidsInput
                                        type="number"
                                        min={minimumKidsHours}
                                        max="12"
                                        value={kidsMonitorHours}
                                        onChange={(e) =>
                                            setKidsMonitorHours(
                                                Math.max(minimumKidsHours, Number(e.target.value) || 0)
                                            )
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

                                {kidsMonitorHours > 0 && (
                                    <S.SummaryItem>
                                        <span>Monitor kids</span>
                                        <strong>{kidsMonitorHours}h</strong>
                                    </S.SummaryItem>
                                )}
                            </S.SummaryList>

                            <S.Divider />

                            {quoteLoading && (
                                <S.QuoteLoading>Calculando cotação...</S.QuoteLoading>
                            )}

                            {normalizedQuote && !quoteLoading && (
                                <>
                                    {normalizedQuote.items?.map((item, i) => (
                                        <S.SummaryItem key={i}>
                                            <span>
                                                {item.type === "PLAN_BASE"
                                                    ? `Plano: ${selectedPlan?.label || item.description || item.label}`
                                                    : item.type === "KIDS_MONITOR_EXTRA_HOUR"
                                                        ? "Horas extras área kids"
                                                        : item.description || item.label}
                                            </span>
                                            <strong>
                                                {formatCurrency(
                                                    Number(
                                                        item.totalAmountCents ??
                                                        item.amountCents ??
                                                        item.totalCents ??
                                                        item.totalAmount ??
                                                        item.amount ??
                                                        0
                                                    )
                                                )}
                                            </strong>
                                        </S.SummaryItem>
                                    ))}

                                    <S.TotalRow>
                                        <span>Total</span>
                                        <strong>{formatCurrency(normalizedQuote.totalCents)}</strong>
                                    </S.TotalRow>
                                </>
                            )}

                            {!normalizedQuote && !quoteLoading && selectedPlan && (
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
                                disabled={submitting || Boolean(planIsIncompatible) || !acceptedContract}
                            >
                                {submitting ? "Confirmando reserva..." : "Confirmar e ir para pagamento"}
                            </S.ConfirmButton>

                            <S.ContractCard>
                                <S.ContractTitle>Contrato da reserva</S.ContractTitle>
                                <S.ContractDescription>
                                    O contrato é gerado automaticamente com base no plano e data escolhidos. Baixe e leia antes de confirmar.
                                </S.ContractDescription>

                                {planCode ? (
                                    <S.ContractDownloadWrapper>
                                        <ErrorBoundary fallback={<span>Erro ao gerar contrato. Tente novamente.</span>}>
                                            <Suspense fallback={<span>Carregando...</span>}>
                                                <ContratoDownloadLink
                                                    contratoProps={contratoProps}
                                                    fileName={`contrato-recanto-vila-rica-${eventDate || "reserva"}.pdf`}
                                                />
                                            </Suspense>
                                        </ErrorBoundary>
                                    </S.ContractDownloadWrapper>
                                ) : (
                                    <S.ContractDescription style={{ fontStyle: "italic" }}>
                                        Selecione um plano para gerar o contrato.
                                    </S.ContractDescription>
                                )}

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