import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import api from "../../services/api";
import { getErrorMessage } from "../../utils/getErrorMessage";
import * as S from "./styles";

export default function ReservationIntent() {
    const { venueId } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [eventDate, setEventDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [durationHours, setDurationHours] = useState(4);

    const [hasKidsArea, setHasKidsArea] = useState(false);
    const [kidsAreaDurationHours, setKidsAreaDurationHours] = useState(1);

    const [hasPool, setHasPool] = useState(false);

    const [acceptedContract, setAcceptedContract] = useState(false);

    useEffect(() => {
        async function loadVenue() {
            try {
                setLoading(true);

                const response = await api.get(`/venues/${venueId}`);
                setVenue(response.data.data);
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
        if (kidsAreaDurationHours > durationHours) {
            setKidsAreaDurationHours(durationHours);
        }
    }, [durationHours, kidsAreaDurationHours]);

    const values = useMemo(() => {
        const basePricePerHour = Number(venue?.basePricePerHour || 0);

        const kidsAreaPricePerHour = 25;
        const poolPricePerDay = 100;

        const partyValue = basePricePerHour * durationHours;
        const kidsAreaValue = hasKidsArea ? kidsAreaPricePerHour * kidsAreaDurationHours : 0;
        const poolValue = hasPool ? poolPricePerDay : 0;

        const total = partyValue + kidsAreaValue + poolValue;

        return {
            basePricePerHour,
            kidsAreaPricePerHour,
            poolPricePerDay,
            partyValue,
            kidsAreaValue,
            poolValue,
            total,
        };
    }, [venue, durationHours, hasKidsArea, kidsAreaDurationHours, hasPool]);

    const today = new Date().toISOString().split("T")[0];

    function formatCurrency(value) {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(Number(value || 0));
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
        try {
            if (!eventDate) {
                toast.warning("Selecione a data do evento.");
                return;
            }

            if (!startTime) {
                toast.warning("Selecione o horário de início.");
                return;
            }

            setSubmitting(true);

            const payload = {
                venueId,
                date: eventDate,
                startTime,
                durationHours,
                kidsAreaIncluded: hasKidsArea,
                kidsAreaDurationHours: hasKidsArea ? kidsAreaDurationHours : 0,
                poolIncluded: hasPool,
            };

            const response = await api.post("/reservations/intent", payload);

            const reservationData = response.data?.data || response.data;
            const reservationId = reservationData?.reservationId || reservationData?.reservation?.id;

            if (!reservationId) {
                toast.error("Não foi possível obter o identificador da reserva.");
                return;
            }

            toast.success("Reserva criada com sucesso! Redirecionando para o pagamento...");
            navigate(`/checkout/${reservationId}`);
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

    return (
        <S.Container>
            <S.Content>
                <S.TopSection>
                    <div>
                        <S.PageTitle>Intenção de reserva</S.PageTitle>
                        <S.PageDescription>
                            Confira os dados do salão, selecione os adicionais disponíveis,
                            escolha data e horário e veja o valor estimado da sua reserva.
                        </S.PageDescription>
                    </div>

                    <S.EstimatedCard>
                        <span>Valor estimado</span>
                        <strong>{formatCurrency(values.total)}</strong>
                        <small>{durationHours} hora(s) de festa</small>
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
                                Escolha a data do evento e o horário de início da festa.
                            </S.CardDescription>

                            <S.FormRow>
                                <Input
                                    label="Data do evento"
                                    type="date"
                                    min={today}
                                    value={eventDate}
                                    onChange={(event) => setEventDate(event.target.value)}
                                />

                                <Input
                                    label="Horário de início"
                                    type="time"
                                    value={startTime || ""}
                                    min="08:00"
                                    max="22:00"
                                    onChange={(event) => setStartTime(event.target.value)}
                                />
                            </S.FormRow>
                        </S.Card>

                        <S.Card>
                            <S.CardTitle>Duração da festa</S.CardTitle>
                            <S.CardDescription>
                                Ajuste a quantidade de horas desejada para o evento.
                            </S.CardDescription>

                            <S.RangeValue>{durationHours} hora(s)</S.RangeValue>

                            <S.StyledRange
                                type="range"
                                min="1"
                                max="12"
                                step="1"
                                value={durationHours}
                                onChange={(event) => setDurationHours(Number(event.target.value))}
                            />

                            <S.RangeLabels>
                                <span>1h</span>
                                <span>12h</span>
                            </S.RangeLabels>
                        </S.Card>

                        <S.Card>
                            <S.CardTitle>Adicionais</S.CardTitle>
                            <S.CardDescription>
                                Escolha os adicionais disponíveis para compor sua reserva.
                            </S.CardDescription>

                            <S.OptionsList>
                                <S.OptionItem>
                                    <div>
                                        <strong>Área Kids</strong>
                                        <span>
                                            {venue.hasKidsArea
                                                ? `+ ${formatCurrency(25)} / hora com monitor`
                                                : "Não disponível"}
                                        </span>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={hasKidsArea}
                                        disabled={!venue.hasKidsArea}
                                        onChange={(event) => {
                                            const checked = event.target.checked;
                                            setHasKidsArea(checked);

                                            if (checked && kidsAreaDurationHours > durationHours) {
                                                setKidsAreaDurationHours(durationHours);
                                            }
                                        }}
                                    />
                                </S.OptionItem>

                                {hasKidsArea && venue.hasKidsArea && (
                                    <S.Card>
                                        <S.CardTitle>Tempo da Área Kids</S.CardTitle>
                                        <S.CardDescription>
                                            Defina por quantas horas a área kids com monitor será utilizada.
                                        </S.CardDescription>

                                        <S.RangeValue>{kidsAreaDurationHours} hora(s)</S.RangeValue>

                                        <S.StyledRange
                                            type="range"
                                            min="1"
                                            max={durationHours}
                                            step="1"
                                            value={kidsAreaDurationHours}
                                            onChange={(event) =>
                                                setKidsAreaDurationHours(Number(event.target.value))
                                            }
                                        />

                                        <S.RangeLabels>
                                            <span>1h</span>
                                            <span>{durationHours}h</span>
                                        </S.RangeLabels>
                                    </S.Card>
                                )}

                                <S.OptionItem>
                                    <div>
                                        <strong>Piscina</strong>
                                        <span>
                                            {venue.hasPool
                                                ? `+ ${formatCurrency(100)}`
                                                : "Não disponível"}
                                        </span>
                                    </div>

                                    <input
                                        type="checkbox"
                                        checked={hasPool}
                                        disabled={!venue.hasPool}
                                        onChange={(event) => setHasPool(event.target.checked)}
                                    />
                                </S.OptionItem>
                            </S.OptionsList>
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
                                    <span>Data</span>
                                    <strong>{eventDate || "Não selecionada"}</strong>
                                </S.SummaryItem>

                                <S.SummaryItem>
                                    <span>Início</span>
                                    <strong>{startTime || "Não selecionado"}</strong>
                                </S.SummaryItem>

                                <S.SummaryItem>
                                    <span>Festa</span>
                                    <strong>
                                        {durationHours}h × {formatCurrency(values.basePricePerHour)}
                                    </strong>
                                </S.SummaryItem>

                                <S.SummaryItem>
                                    <span>Área Kids</span>
                                    <strong>
                                        {hasKidsArea
                                            ? `${kidsAreaDurationHours}h × ${formatCurrency(
                                                values.kidsAreaPricePerHour
                                            )}`
                                            : "Não incluída"}
                                    </strong>
                                </S.SummaryItem>

                                <S.SummaryItem>
                                    <span>Piscina</span>
                                    <strong>
                                        {hasPool ? formatCurrency(values.poolValue) : "Não incluída"}
                                    </strong>
                                </S.SummaryItem>
                            </S.SummaryList>

                            <S.Divider />

                            <S.TotalRow>
                                <span>Total estimado</span>
                                <strong>{formatCurrency(values.total)}</strong>
                            </S.TotalRow>
                        </S.Card>

                        <S.ActionCard>
                            <S.ConfirmButton
                                type="button"
                                onClick={handleConfirmReservation}
                                disabled={submitting || !acceptedContract}
                            >
                                {submitting
                                    ? "Confirmando reserva..."
                                    : "Confirmar e ir para pagamento"}
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
                                        onChange={(event) => setAcceptedContract(event.target.checked)}
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