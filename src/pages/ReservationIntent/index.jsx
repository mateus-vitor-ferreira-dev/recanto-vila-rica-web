import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../../services/api";
import * as S from "./styles";

export default function ReservationIntent() {
    const { venueId } = useParams();
    const navigate = useNavigate();

    const [venue, setVenue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [partyDuration, setPartyDuration] = useState(4);
    const [hasKidsAreaSelected, setHasKidsAreaSelected] = useState(false);
    const [hasPoolSelected, setHasPoolSelected] = useState(false);
    const [kidsAreaDuration, setKidsAreaDuration] = useState(1);
    const [poolDuration, setPoolDuration] = useState(1);

    const [eventDate, setEventDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isContractOpen, setIsContractOpen] = useState(false);

    useEffect(() => {
        async function loadVenue() {
            try {
                setIsLoading(true);

                const { data } = await api.get(`/venues/${venueId}`);
                setVenue(data.data);
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error?.message ||
                    "Erro ao carregar os dados do salão.";

                toast.error(message);
            } finally {
                setIsLoading(false);
            }
        }

        loadVenue();
    }, [venueId]);

    useEffect(() => {
        if (!hasKidsAreaSelected) {
            setKidsAreaDuration(1);
        }
    }, [hasKidsAreaSelected]);

    useEffect(() => {
        if (!hasPoolSelected) {
            setPoolDuration(1);
        }
    }, [hasPoolSelected]);

    useEffect(() => {
        if (kidsAreaDuration > partyDuration) {
            setKidsAreaDuration(partyDuration);
        }

        if (poolDuration > partyDuration) {
            setPoolDuration(partyDuration);
        }
    }, [partyDuration, kidsAreaDuration, poolDuration]);

    const totalPrice = useMemo(() => {
        if (!venue) return 0;

        const basePricePerHour = Number(venue.basePricePerHour || 0);
        const kidsAreaPricePerHour = Number(venue.kidsAreaPricePerHour || 0);
        const poolPricePerHour = Number(venue.poolPricePerHour || 0);

        let total = partyDuration * basePricePerHour;

        if (venue.hasKidsArea && hasKidsAreaSelected) {
            total += kidsAreaDuration * kidsAreaPricePerHour;
        }

        if (venue.hasPool && hasPoolSelected) {
            total += poolDuration * poolPricePerHour;
        }

        return total;
    }, [
        venue,
        partyDuration,
        hasKidsAreaSelected,
        hasPoolSelected,
        kidsAreaDuration,
        poolDuration,
    ]);

    function buildReservationPayload() {
        const startDate = new Date(`${eventDate}T${startTime}`);
        const endDate = new Date(startDate);
        endDate.setHours(endDate.getHours() + partyDuration);

        return {
            venueId: venue.id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            totalPrice,
            notes: JSON.stringify({
                partyDuration,
                hasKidsAreaSelected,
                kidsAreaDuration: hasKidsAreaSelected ? kidsAreaDuration : 0,
                hasPoolSelected,
                poolDuration: hasPoolSelected ? poolDuration : 0,
            }),
        };
    }

    async function handleConfirmReservation() {
        if (!eventDate) {
            return toast.error("Selecione a data do evento.");
        }

        if (!startTime) {
            return toast.error("Selecione o horário de início.");
        }

        if (!venue) {
            return toast.error("Salão não encontrado.");
        }

        try {
            setIsSubmitting(true);

            const payload = buildReservationPayload();
            const reservationResponse = await api.post("/reservations", payload);

            const reservationId = reservationResponse.data?.data?.id;

            if (!reservationId) {
                throw new Error("Reservation id not returned");
            }

            toast.success("Reserva criada com sucesso.");
            navigate(`/payment/${reservationId}`);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error?.message ||
                error.message ||
                "Erro ao confirmar a reserva.";

            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <S.Container>
                <S.LoadingCard>
                    <h2>Carregando intenção de reserva...</h2>
                    <p>Buscando informações do salão selecionado.</p>
                </S.LoadingCard>
            </S.Container>
        );
    }

    if (!venue) {
        return (
            <S.Container>
                <S.EmptyState>
                    <h2>Salão não encontrado</h2>
                    <p>Não foi possível carregar os dados da reserva.</p>
                </S.EmptyState>
            </S.Container>
        );
    }

    return (
        <S.Container>
            <S.Header>
                <div>
                    <S.Title>Intenção de reserva</S.Title>
                    <S.Description>
                        Confira os dados do salão, selecione os adicionais disponíveis,
                        escolha data e horário e veja o valor estimado da sua reserva.
                    </S.Description>
                </div>

                <S.PriceCard>
                    <span>Valor estimado</span>
                    <strong>
                        {totalPrice.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </strong>
                    <small>{partyDuration} hora(s) de festa</small>
                </S.PriceCard>
            </S.Header>

            <S.ContentGrid>
                <S.LeftColumn>
                    <S.SectionCard>
                        <S.SectionTitle>{venue.name}</S.SectionTitle>
                        <S.SectionText>
                            {venue.description || "Sem descrição cadastrada para este salão."}
                        </S.SectionText>

                        <S.InfoGrid>
                            <S.InfoItem>
                                <span>Capacidade</span>
                                <strong>
                                    {venue.capacity ? `${venue.capacity} pessoas` : "Não informada"}
                                </strong>
                            </S.InfoItem>

                            <S.InfoItem>
                                <span>Localização</span>
                                <strong>{venue.location || "Não informada"}</strong>
                            </S.InfoItem>
                        </S.InfoGrid>

                        {venue.mapsUrl && (
                            <S.RouteButton
                                href={venue.mapsUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Rotas
                            </S.RouteButton>
                        )}
                    </S.SectionCard>

                    <S.SectionCard>
                        <S.SectionTitle>Data e horário</S.SectionTitle>
                        <S.SectionText>
                            Escolha a data do evento e o horário de início da festa.
                        </S.SectionText>

                        <S.FormGrid>
                            <S.FieldGroup>
                                <S.FieldLabel htmlFor="eventDate">Data do evento</S.FieldLabel>
                                <S.DateInput
                                    id="eventDate"
                                    type="date"
                                    value={eventDate}
                                    onChange={(event) => setEventDate(event.target.value)}
                                />
                            </S.FieldGroup>

                            <S.FieldGroup>
                                <S.FieldLabel htmlFor="startTime">Horário de início</S.FieldLabel>
                                <S.TimeInput
                                    id="startTime"
                                    type="time"
                                    value={startTime}
                                    onChange={(event) => setStartTime(event.target.value)}
                                />
                            </S.FieldGroup>
                        </S.FormGrid>
                    </S.SectionCard>

                    <S.SectionCard>
                        <S.SectionTitle>Duração da festa</S.SectionTitle>
                        <S.SectionText>
                            Ajuste a quantidade de horas desejada para o evento.
                        </S.SectionText>

                        <S.RangeWrapper>
                            <S.RangeLabel>{partyDuration} hora(s)</S.RangeLabel>
                            <S.RangeInput
                                type="range"
                                min="1"
                                max="12"
                                step="1"
                                value={partyDuration}
                                onChange={(event) => setPartyDuration(Number(event.target.value))}
                            />
                            <S.RangeScale>
                                <span>1h</span>
                                <span>12h</span>
                            </S.RangeScale>
                        </S.RangeWrapper>
                    </S.SectionCard>

                    {(venue.hasKidsArea || venue.hasPool) && (
                        <S.SectionCard>
                            <S.SectionTitle>Adicionais disponíveis</S.SectionTitle>
                            <S.SectionText>
                                Marque os opcionais que deseja incluir na sua reserva.
                            </S.SectionText>

                            <S.OptionsList>
                                {venue.hasKidsArea && (
                                    <S.OptionBlock>
                                        <S.OptionItem>
                                            <S.OptionInfo>
                                                <strong>Área Kids</strong>
                                                <span>
                                                    {Number(venue.kidsAreaPricePerHour || 0).toLocaleString(
                                                        "pt-BR",
                                                        {
                                                            style: "currency",
                                                            currency: "BRL",
                                                        }
                                                    )}{" "}
                                                    por hora
                                                </span>
                                            </S.OptionInfo>

                                            <S.OptionAction>
                                                <input
                                                    type="checkbox"
                                                    checked={hasKidsAreaSelected}
                                                    onChange={() => setHasKidsAreaSelected((prev) => !prev)}
                                                />
                                            </S.OptionAction>
                                        </S.OptionItem>

                                        {hasKidsAreaSelected && (
                                            <S.RangeWrapper>
                                                <S.RangeLabel>
                                                    Área Kids: {kidsAreaDuration} hora(s)
                                                </S.RangeLabel>
                                                <S.RangeInput
                                                    type="range"
                                                    min="1"
                                                    max={partyDuration}
                                                    step="1"
                                                    value={kidsAreaDuration}
                                                    onChange={(event) =>
                                                        setKidsAreaDuration(Number(event.target.value))
                                                    }
                                                />
                                                <S.RangeScale>
                                                    <span>1h</span>
                                                    <span>{partyDuration}h</span>
                                                </S.RangeScale>
                                            </S.RangeWrapper>
                                        )}
                                    </S.OptionBlock>
                                )}

                                {venue.hasPool && (
                                    <S.OptionBlock>
                                        <S.OptionItem>
                                            <S.OptionInfo>
                                                <strong>Piscina</strong>
                                                <span>
                                                    {Number(venue.poolPricePerHour || 0).toLocaleString(
                                                        "pt-BR",
                                                        {
                                                            style: "currency",
                                                            currency: "BRL",
                                                        }
                                                    )}{" "}
                                                    por hora
                                                </span>
                                            </S.OptionInfo>

                                            <S.OptionAction>
                                                <input
                                                    type="checkbox"
                                                    checked={hasPoolSelected}
                                                    onChange={() => setHasPoolSelected((prev) => !prev)}
                                                />
                                            </S.OptionAction>
                                        </S.OptionItem>

                                        {hasPoolSelected && (
                                            <S.RangeWrapper>
                                                <S.RangeLabel>
                                                    Piscina: {poolDuration} hora(s)
                                                </S.RangeLabel>
                                                <S.RangeInput
                                                    type="range"
                                                    min="1"
                                                    max={partyDuration}
                                                    step="1"
                                                    value={poolDuration}
                                                    onChange={(event) =>
                                                        setPoolDuration(Number(event.target.value))
                                                    }
                                                />
                                                <S.RangeScale>
                                                    <span>1h</span>
                                                    <span>{partyDuration}h</span>
                                                </S.RangeScale>
                                            </S.RangeWrapper>
                                        )}
                                    </S.OptionBlock>
                                )}
                            </S.OptionsList>
                        </S.SectionCard>
                    )}

                    <S.SectionCard>
                        <S.ContractHeader>
                            <div>
                                <S.SectionTitle>Contrato</S.SectionTitle>
                                <S.SectionText>
                                    Leia as condições antes de prosseguir.
                                </S.SectionText>
                            </div>

                            <S.ToggleContractButton
                                type="button"
                                onClick={() => setIsContractOpen((prev) => !prev)}
                            >
                                {isContractOpen ? "Ocultar contrato" : "Ver contrato"}
                            </S.ToggleContractButton>
                        </S.ContractHeader>

                        {isContractOpen && (
                            <S.ContractBox>
                                <p>
                                    <strong>CONTRATO DE INTENÇÃO DE RESERVA</strong>
                                </p>

                                <p>
                                    O presente documento apresenta uma estimativa preliminar da
                                    reserva do espaço <strong>{venue.name}</strong>, conforme
                                    disponibilidade da data, horário e opcionais selecionados.
                                </p>

                                <p>
                                    A contratação definitiva dependerá da validação final do pedido,
                                    aceite contratual completo e eventual pagamento do sinal.
                                </p>

                                <p>
                                    Os valores apresentados nesta etapa possuem caráter informativo e
                                    poderão ser ajustados futuramente conforme regras comerciais,
                                    duração contratada e serviços adicionais incluídos.
                                </p>
                            </S.ContractBox>
                        )}
                    </S.SectionCard>
                </S.LeftColumn>

                <S.RightColumn>
                    <S.SectionCard>
                        <S.SectionTitle>Resumo da reserva</S.SectionTitle>

                        <S.SummaryList>
                            <li>
                                <span>Salão</span>
                                <strong>{venue.name}</strong>
                            </li>

                            <li>
                                <span>Data</span>
                                <strong>{eventDate || "Não selecionada"}</strong>
                            </li>

                            <li>
                                <span>Início</span>
                                <strong>{startTime || "Não selecionado"}</strong>
                            </li>

                            <li>
                                <span>Festa</span>
                                <strong>
                                    {partyDuration}h ×{" "}
                                    {Number(venue.basePricePerHour || 0).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </strong>
                            </li>

                            {venue.hasKidsArea && (
                                <li>
                                    <span>Área Kids</span>
                                    <strong>
                                        {hasKidsAreaSelected
                                            ? `${kidsAreaDuration}h × ${Number(
                                                venue.kidsAreaPricePerHour || 0
                                            ).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}`
                                            : "Não incluída"}
                                    </strong>
                                </li>
                            )}

                            {venue.hasPool && (
                                <li>
                                    <span>Piscina</span>
                                    <strong>
                                        {hasPoolSelected
                                            ? `${poolDuration}h × ${Number(
                                                venue.poolPricePerHour || 0
                                            ).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}`
                                            : "Não incluída"}
                                    </strong>
                                </li>
                            )}

                            <li className="total">
                                <span>Total estimado</span>
                                <strong>
                                    {totalPrice.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </strong>
                            </li>
                        </S.SummaryList>
                    </S.SectionCard>

                    <S.ActionsCard>
                        <S.PrimaryActionButton
                            type="button"
                            onClick={handleConfirmReservation}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Redirecionando..." : "Confirmar e ir para pagamento"}
                        </S.PrimaryActionButton>
                    </S.ActionsCard>
                </S.RightColumn>
            </S.ContentGrid>
        </S.Container>
    );
}