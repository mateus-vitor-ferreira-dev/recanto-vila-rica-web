import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useGSAP } from "@gsap/react";

import {
    createCampaign,
    createHoliday,
    deleteHoliday,
    drawRaffleWinner,
    getReservationsSummary,
    listAdminReservations,
    listCampaigns,
    listHolidays,
    syncHolidays,
    syncMunicipalHolidays,
    updateCampaign,
} from "../../services/admin";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { animateStagger } from "../../utils/animations";
import * as S from "./styles";

// ─── Constants ─────────────────────────────────────────────────────────────

const TABS = [
    { key: "dashboard", label: "Dashboard" },
    { key: "reservations", label: "Reservas" },
    { key: "campaigns", label: "Campanhas" },
    { key: "holidays", label: "Feriados" },
];

const STATUS_OPTIONS = [
    { value: "", label: "Todos os status" },
    { value: "PENDING", label: "Pendente" },
    { value: "PAID", label: "Pago" },
    { value: "CANCELLED", label: "Cancelado" },
    { value: "EXPIRED", label: "Expirado" },
];

const STATUS_LABELS = {
    PENDING: "Pendente",
    PAID: "Pago",
    CANCELLED: "Cancelado",
    EXPIRED: "Expirado",
};

const CAMPAIGN_TYPE_LABELS = {
    REFERRAL_NEXT_BOOKING: "Indicação",
    LOYALTY_ALWAYS_HERE: "Fidelidade",
    RAFFLE_VIP: "Sorteio VIP",
};

const CAMPAIGN_TYPE_OPTIONS = [
    { value: "REFERRAL_NEXT_BOOKING", label: "Indicação (REFERRAL_NEXT_BOOKING)" },
    { value: "LOYALTY_ALWAYS_HERE", label: "Fidelidade (LOYALTY_ALWAYS_HERE)" },
    { value: "RAFFLE_VIP", label: "Sorteio VIP (RAFFLE_VIP)" },
];

const HOLIDAY_TYPE_OPTIONS = [
    { value: "national", label: "Nacional" },
    { value: "state", label: "Estadual" },
    { value: "municipal", label: "Municipal" },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCampaignStatus(campaign) {
    const now = new Date();
    if (!campaign.isActive) return "disabled";
    if (new Date(campaign.startsAt) > now) return "scheduled";
    if (new Date(campaign.endsAt) < now) return "ended";
    return "active";
}

const CAMPAIGN_STATUS_LABELS = {
    active: "Ativa",
    scheduled: "Aguarda início",
    ended: "Encerrada",
    disabled: "Desativada",
};

function formatDate(date) {
    return new Date(date).toLocaleDateString("pt-BR");
}

function getCampaignDateDisplay(campaign) {
    const year = new Date().getFullYear();

    if (campaign.type === "LOYALTY_ALWAYS_HERE") {
        return "O ANO TODO";
    }

    if (campaign.type === "REFERRAL_NEXT_BOOKING") {
        return `01/03/${year} → 01/08/${year}`;
    }

    if (campaign.type === "RAFFLE_VIP") {
        const nextYear = year + 1;
        const lastDayFeb = new Date(nextYear, 2, 0).getDate();
        return `01/08/${year} → ${String(lastDayFeb).padStart(2, "0")}/02/${nextYear}`;
    }

    return `${formatDate(campaign.startsAt)} → ${formatDate(campaign.endsAt)}`;
}

function formatDateTime(date) {
    return new Date(date).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
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

// ─── Dashboard Tab ───────────────────────────────────────────────────────────

function DashboardTab() {
    const sectionRef = useRef(null);
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await getReservationsSummary();
                setSummary(data);
            } catch (error) {
                toast.error(getErrorMessage(error, "Erro ao carregar métricas."));
            } finally {
                setIsLoading(false);
            }
        }
        load();
    }, []);

    useGSAP(() => {
        if (isLoading || !sectionRef.current) return;
        animateStagger(sectionRef.current.querySelectorAll(".anim-card"));
    }, { scope: sectionRef, dependencies: [isLoading] });

    if (isLoading) return <S.LoadingSpinner />;

    if (!summary) return null;

    const stripe = summary.revenueByMethod?.stripe;
    const pix = summary.revenueByMethod?.pix;

    return (
        <S.Section ref={sectionRef}>
            <S.SectionTitle>Visão geral</S.SectionTitle>
            <S.SummaryGrid>
                <S.SummaryCard className="anim-card">
                    <S.SummaryLabel>Total de reservas</S.SummaryLabel>
                    <S.SummaryValue>{summary.totalReservations ?? 0}</S.SummaryValue>
                </S.SummaryCard>

                <S.SummaryCard className="anim-card">
                    <S.SummaryLabel>Receita confirmada</S.SummaryLabel>
                    <S.SummaryValue $accent>
                        {formatCurrency(summary.totalRevenue ?? 0)}
                    </S.SummaryValue>
                </S.SummaryCard>

                <S.SummaryCard className="anim-card">
                    <S.SummaryLabel>Pendentes</S.SummaryLabel>
                    <S.SummaryValue>{summary.pendingReservations ?? 0}</S.SummaryValue>
                    <S.SummarySubtitle>aguardando pagamento</S.SummarySubtitle>
                </S.SummaryCard>

                <S.SummaryCard className="anim-card">
                    <S.SummaryLabel>Pagas</S.SummaryLabel>
                    <S.SummaryValue>{summary.paidReservations ?? 0}</S.SummaryValue>
                    <S.SummarySubtitle>confirmadas</S.SummarySubtitle>
                </S.SummaryCard>

                <S.SummaryCard className="anim-card">
                    <S.SummaryLabel>Canceladas</S.SummaryLabel>
                    <S.SummaryValue>{summary.cancelledReservations ?? 0}</S.SummaryValue>
                </S.SummaryCard>

                <S.SummaryCard className="anim-card">
                    <S.SummaryLabel>Expiradas</S.SummaryLabel>
                    <S.SummaryValue>{summary.expiredReservations ?? 0}</S.SummaryValue>
                </S.SummaryCard>
            </S.SummaryGrid>

            <S.SectionTitle style={{ marginTop: "32px" }}>Receita por método</S.SectionTitle>
            <S.RevenueBreakdown>
                <S.RevenueMethodCard className="anim-card">
                    <S.RevenueMethodIcon>💳</S.RevenueMethodIcon>
                    <S.RevenueMethodInfo>
                        <S.SummaryLabel>Cartão de Crédito</S.SummaryLabel>
                        <S.SummaryValue $accent>{formatCurrency(stripe?.amount ?? 0)}</S.SummaryValue>
                        <S.SummarySubtitle>{stripe?.count ?? 0} pagamento{stripe?.count !== 1 ? "s" : ""}</S.SummarySubtitle>
                    </S.RevenueMethodInfo>
                </S.RevenueMethodCard>

                <S.RevenueMethodCard className="anim-card">
                    <S.RevenueMethodIcon>⚡</S.RevenueMethodIcon>
                    <S.RevenueMethodInfo>
                        <S.SummaryLabel>PIX</S.SummaryLabel>
                        <S.SummaryValue $accent>{formatCurrency(pix?.amount ?? 0)}</S.SummaryValue>
                        <S.SummarySubtitle>{pix?.count ?? 0} pagamento{pix?.count !== 1 ? "s" : ""}</S.SummarySubtitle>
                    </S.RevenueMethodInfo>
                </S.RevenueMethodCard>
            </S.RevenueBreakdown>
        </S.Section>
    );
}

// ─── Reservations Tab ────────────────────────────────────────────────────────

function ReservationsTab() {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const limit = 15;

    async function load(currentPage = 1) {
        try {
            setIsLoading(true);
            const filters = { page: currentPage, limit };
            if (status) filters.status = status;
            if (startDate) filters.startDate = new Date(startDate).toISOString();
            if (endDate) filters.endDate = new Date(endDate + "T23:59:59").toISOString();

            const result = await listAdminReservations(filters);
            const list = result?.data ?? result ?? [];
            setReservations(list);
            setHasMore(list.length === limit);
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao carregar reservas."));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        setPage(1);
        load(1);
    }, [status, startDate, endDate]);

    function handlePageChange(next) {
        setPage(next);
        load(next);
    }

    return (
        <S.Section>
            <S.SectionHeader>
                <S.SectionTitle>Todas as reservas</S.SectionTitle>
            </S.SectionHeader>

            <S.FiltersRow>
                <S.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </S.Select>

                <S.DateInput
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    title="Data inicial"
                />

                <S.DateInput
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    title="Data final"
                />
            </S.FiltersRow>

            {isLoading ? (
                <S.LoadingSpinner />
            ) : reservations.length === 0 ? (
                <S.EmptyState>
                    <h3>Nenhuma reserva encontrada</h3>
                    <p>Tente ajustar os filtros.</p>
                </S.EmptyState>
            ) : (
                <>
                    <S.TableWrapper>
                        <S.Table>
                            <thead>
                                <tr>
                                    <S.Th>Cliente</S.Th>
                                    <S.Th>Espaço</S.Th>
                                    <S.Th>Início</S.Th>
                                    <S.Th>Fim</S.Th>
                                    <S.Th>Plano</S.Th>
                                    <S.Th>Valor</S.Th>
                                    <S.Th>Status</S.Th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((r) => (
                                    <S.Tr key={r.id}>
                                        <S.Td>{r.user?.name ?? r.userId?.slice(0, 8) + "..."}</S.Td>
                                        <S.Td>{r.venue?.name ?? r.venueId}</S.Td>
                                        <S.Td>{formatDateTime(r.startDate)}</S.Td>
                                        <S.Td>{formatDateTime(r.endDate)}</S.Td>
                                        <S.Td>{r.planCode ?? "—"}</S.Td>
                                        <S.Td>{formatCurrency(r.totalPrice ?? 0)}</S.Td>
                                        <S.Td>
                                            <S.StatusBadge $status={r.status}>
                                                {STATUS_LABELS[r.status] ?? r.status}
                                            </S.StatusBadge>
                                        </S.Td>
                                    </S.Tr>
                                ))}
                            </tbody>
                        </S.Table>
                    </S.TableWrapper>

                    <S.Pagination>
                        <S.PageButton onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                            Anterior
                        </S.PageButton>
                        <S.PageInfo>Página {page}</S.PageInfo>
                        <S.PageButton onClick={() => handlePageChange(page + 1)} disabled={!hasMore}>
                            Próxima
                        </S.PageButton>
                    </S.Pagination>
                </>
            )}
        </S.Section>
    );
}

// ─── Campaigns Tab ───────────────────────────────────────────────────────────

function buildWinnerMessage(winner, campaignName) {
    return `Olá, ${winner.name}! 🎉

Você foi o grande sorteado do *${campaignName}* do Recanto Vila Rica!

Para resgatar seu prêmio, publique um stories no Instagram marcando @recantovilarica e nos envie a confirmação. 📸

Qualquer dúvida, é só entrar em contato. Parabéns! 🥳`;
}

function CampaignsTab() {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [togglingId, setTogglingId] = useState(null);
    const [drawingId, setDrawingId] = useState(null);
    const [winnerResult, setWinnerResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [form, setForm] = useState({
        code: "",
        type: "REFERRAL_NEXT_BOOKING",
        name: "",
        startsAt: "",
        endsAt: "",
    });
    const [isSaving, setIsSaving] = useState(false);

    async function load() {
        try {
            setIsLoading(true);
            const data = await listCampaigns();
            setCampaigns(data ?? []);
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao carregar campanhas."));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleToggle(campaign) {
        try {
            setTogglingId(campaign.id);
            await updateCampaign(campaign.id, { isActive: !campaign.isActive });
            toast.success(
                `Campanha ${!campaign.isActive ? "ativada" : "desativada"} com sucesso.`
            );
            load();
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao atualizar campanha."));
        } finally {
            setTogglingId(null);
        }
    }

    async function handleDrawWinner(campaign) {
        try {
            setDrawingId(campaign.id);
            const result = await drawRaffleWinner(campaign.id);
            setWinnerResult(result);
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao realizar sorteio."));
        } finally {
            setDrawingId(null);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        try {
            setIsSaving(true);
            await createCampaign({
                ...form,
                startsAt: new Date(form.startsAt).toISOString(),
                endsAt: new Date(form.endsAt + "T23:59:59").toISOString(),
            });
            toast.success("Campanha criada com sucesso.");
            setShowCreateModal(false);
            setForm({ code: "", type: "REFERRAL_NEXT_BOOKING", name: "", startsAt: "", endsAt: "" });
            load();
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao criar campanha."));
        } finally {
            setIsSaving(false);
        }
    }

    function handleCopyMessage(message) {
        navigator.clipboard.writeText(message).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <S.Section>
            <S.SectionHeader>
                <S.SectionTitle>Campanhas promocionais</S.SectionTitle>
                <S.PrimaryButton onClick={() => setShowCreateModal(true)}>
                    + Nova campanha
                </S.PrimaryButton>
            </S.SectionHeader>

            {isLoading ? (
                <S.LoadingSpinner />
            ) : campaigns.length === 0 ? (
                <S.EmptyState>
                    <h3>Nenhuma campanha cadastrada</h3>
                    <p>Crie a primeira campanha clicando no botão acima.</p>
                </S.EmptyState>
            ) : (
                <S.CardList>
                    {campaigns.map((c) => {
                        const status = getCampaignStatus(c);
                        return (
                            <S.CampaignCard key={c.id}>
                                <S.CampaignInfo>
                                    <strong>{c.name}</strong>
                                    <span>
                                        {CAMPAIGN_TYPE_LABELS[c.type] ?? c.type} · Código:{" "}
                                        <strong>{c.code}</strong>
                                    </span>
                                    <span>{getCampaignDateDisplay(c)}</span>
                                </S.CampaignInfo>

                                <S.CampaignActions>
                                    <S.CampaignStatusBadge $status={status}>
                                        {CAMPAIGN_STATUS_LABELS[status]}
                                    </S.CampaignStatusBadge>

                                    {c.type === "RAFFLE_VIP" && status === "active" && (
                                        <S.RaffleButton
                                            onClick={() => handleDrawWinner(c)}
                                            disabled={drawingId === c.id}
                                        >
                                            {drawingId === c.id ? "Sorteando..." : "Realizar Sorteio"}
                                        </S.RaffleButton>
                                    )}

                                    <S.SecondaryButton
                                        onClick={() => handleToggle(c)}
                                        disabled={togglingId === c.id}
                                    >
                                        {togglingId === c.id
                                            ? "Salvando..."
                                            : c.isActive
                                            ? "Desativar"
                                            : "Ativar"}
                                    </S.SecondaryButton>
                                </S.CampaignActions>
                            </S.CampaignCard>
                        );
                    })}
                </S.CardList>
            )}

            {/* Modal: criar campanha */}
            {showCreateModal && (
                <S.ModalOverlay onClick={() => setShowCreateModal(false)}>
                    <S.ModalBox onClick={(e) => e.stopPropagation()}>
                        <S.ModalTitle>Nova campanha</S.ModalTitle>

                        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <S.FormGroup>
                                <label>Nome</label>
                                <S.TextInput
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="Ex: Indique um amigo"
                                />
                            </S.FormGroup>

                            <S.FormGroup>
                                <label>Código</label>
                                <S.TextInput
                                    required
                                    value={form.code}
                                    onChange={(e) =>
                                        setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                                    }
                                    placeholder="Ex: REFERRAL_2026"
                                />
                            </S.FormGroup>

                            <S.FormGroup>
                                <label>Tipo</label>
                                <S.Select
                                    value={form.type}
                                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                                    style={{ height: 42 }}
                                >
                                    {CAMPAIGN_TYPE_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </S.Select>
                            </S.FormGroup>

                            <S.FormGroup>
                                <label>Início</label>
                                <S.DateInput
                                    required
                                    type="date"
                                    value={form.startsAt}
                                    onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
                                    style={{ height: 42, width: "100%", boxSizing: "border-box" }}
                                />
                            </S.FormGroup>

                            <S.FormGroup>
                                <label>Encerramento</label>
                                <S.DateInput
                                    required
                                    type="date"
                                    value={form.endsAt}
                                    onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
                                    style={{ height: 42, width: "100%", boxSizing: "border-box" }}
                                />
                            </S.FormGroup>

                            <S.ModalActions>
                                <S.SecondaryButton
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    disabled={isSaving}
                                >
                                    Cancelar
                                </S.SecondaryButton>
                                <S.PrimaryButton type="submit" disabled={isSaving}>
                                    {isSaving ? "Criando..." : "Criar campanha"}
                                </S.PrimaryButton>
                            </S.ModalActions>
                        </form>
                    </S.ModalBox>
                </S.ModalOverlay>
            )}

            {/* Modal: resultado do sorteio */}
            {winnerResult && (
                <S.ModalOverlay onClick={() => { setWinnerResult(null); setCopied(false); }}>
                    <S.ModalBox onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
                        <S.ModalTitle>Ganhador do Sorteio</S.ModalTitle>

                        <S.WinnerCard>
                            <strong>{winnerResult.winner.name}</strong>
                            <span>{winnerResult.winner.email}</span>
                            {winnerResult.winner.phone && (
                                <span>{winnerResult.winner.phone}</span>
                            )}
                            <span style={{ marginTop: 4, fontSize: 12, color: "var(--text-muted)" }}>
                                Sorteado entre {winnerResult.totalEntries}{" "}
                                {winnerResult.totalEntries === 1 ? "participante" : "participantes"}
                            </span>
                        </S.WinnerCard>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
                                Mensagem para enviar ao ganhador:
                            </span>
                            <S.MessagePreview>
                                {buildWinnerMessage(winnerResult.winner, winnerResult.campaignName)}
                            </S.MessagePreview>
                            <S.CopyButton
                                onClick={() =>
                                    handleCopyMessage(
                                        buildWinnerMessage(winnerResult.winner, winnerResult.campaignName)
                                    )
                                }
                            >
                                {copied ? "Copiado!" : "Copiar mensagem"}
                            </S.CopyButton>
                        </div>

                        <S.ModalActions>
                            <S.PrimaryButton onClick={() => { setWinnerResult(null); setCopied(false); }}>
                                Fechar
                            </S.PrimaryButton>
                        </S.ModalActions>
                    </S.ModalBox>
                </S.ModalOverlay>
            )}
        </S.Section>
    );
}

// ─── Holidays Tab ────────────────────────────────────────────────────────────

// Feriados municipais fixos de Lavras — atualizados conforme o ano selecionado
function getMunicipalHolidaysSeed(year) {
    return [
        { name: "Dia de São Sebastião", date: `${year}-01-20` },
        { name: "Dia de Santo Antônio", date: `${year}-06-13` },
        { name: "Aniversário de Lavras", date: `${year}-09-08` },
    ];
}

function HolidaysTab() {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [holidays, setHolidays] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isSyncingMunicipal, setIsSyncingMunicipal] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ date: "", name: "", type: "national" });
    const [isSaving, setIsSaving] = useState(false);

    async function load() {
        try {
            setIsLoading(true);
            const data = await listHolidays(year);
            setHolidays(data ?? []);
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao carregar feriados."));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [year]);

    async function handleSync() {
        try {
            setIsSyncing(true);
            const result = await syncHolidays(year);
            toast.success(`${result.synced} feriados nacionais sincronizados para ${year}.`);
            load();
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao sincronizar feriados nacionais."));
        } finally {
            setIsSyncing(false);
        }
    }

    async function handleSyncMunicipal() {
        try {
            setIsSyncingMunicipal(true);
            const seed = getMunicipalHolidaysSeed(year);
            const result = await syncMunicipalHolidays(year, seed);
            toast.success(`${result.synced} feriados municipais de Lavras sincronizados para ${year}.`);
            load();
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao sincronizar feriados municipais."));
        } finally {
            setIsSyncingMunicipal(false);
        }
    }

    async function handleDelete(id) {
        try {
            setDeletingId(id);
            await deleteHoliday(id);
            toast.success("Feriado removido.");
            setHolidays((prev) => prev.filter((h) => h.id !== id));
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao remover feriado."));
        } finally {
            setDeletingId(null);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        try {
            setIsSaving(true);
            await createHoliday(form);
            toast.success("Feriado criado com sucesso.");
            setShowModal(false);
            setForm({ date: "", name: "", type: "national" });
            load();
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao criar feriado."));
        } finally {
            setIsSaving(false);
        }
    }

    const yearOptions = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];

    return (
        <S.Section>
            <S.SectionHeader>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <S.SectionTitle>Feriados</S.SectionTitle>
                    <S.Select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    >
                        {yearOptions.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </S.Select>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <S.SecondaryButton onClick={handleSync} disabled={isSyncing}>
                        {isSyncing ? "Sincronizando..." : "Sincronizar feriados nacionais"}
                    </S.SecondaryButton>
                    <S.SecondaryButton onClick={handleSyncMunicipal} disabled={isSyncingMunicipal}>
                        {isSyncingMunicipal ? "Sincronizando..." : "Sincronizar feriados municipais"}
                    </S.SecondaryButton>
                    <S.PrimaryButton onClick={() => setShowModal(true)}>
                        + Novo feriado
                    </S.PrimaryButton>
                </div>
            </S.SectionHeader>

            {isLoading ? (
                <S.LoadingSpinner />
            ) : holidays.length === 0 ? (
                <S.EmptyState>
                    <h3>Nenhum feriado cadastrado para {year}</h3>
                    <p>Sincronize com a BrasilAPI ou adicione manualmente.</p>
                </S.EmptyState>
            ) : (
                <S.CardList>
                    {holidays.map((h) => (
                        <S.HolidayCard key={h.id}>
                            <S.HolidayInfo>
                                <strong>{h.name}</strong>
                                <span>{formatDate(h.date)}</span>
                            </S.HolidayInfo>

                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <S.HolidayType>{h.type}</S.HolidayType>
                                <S.DangerButton
                                    onClick={() => handleDelete(h.id)}
                                    disabled={deletingId === h.id}
                                >
                                    {deletingId === h.id ? "Removendo..." : "Remover"}
                                </S.DangerButton>
                            </div>
                        </S.HolidayCard>
                    ))}
                </S.CardList>
            )}

            {showModal && (
                <S.ModalOverlay onClick={() => setShowModal(false)}>
                    <S.ModalBox onClick={(e) => e.stopPropagation()}>
                        <S.ModalTitle>Novo feriado</S.ModalTitle>

                        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                            <S.FormGroup>
                                <label>Nome</label>
                                <S.TextInput
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                    placeholder="Ex: Consciência Negra"
                                />
                            </S.FormGroup>

                            <S.FormGroup>
                                <label>Data</label>
                                <S.DateInput
                                    required
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                                    style={{ height: 42, width: "100%", boxSizing: "border-box" }}
                                />
                            </S.FormGroup>

                            <S.FormGroup>
                                <label>Tipo</label>
                                <S.Select
                                    value={form.type}
                                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                                    style={{ height: 42 }}
                                >
                                    {HOLIDAY_TYPE_OPTIONS.map((o) => (
                                        <option key={o.value} value={o.value}>
                                            {o.label}
                                        </option>
                                    ))}
                                </S.Select>
                            </S.FormGroup>

                            <S.ModalActions>
                                <S.SecondaryButton
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={isSaving}
                                >
                                    Cancelar
                                </S.SecondaryButton>
                                <S.PrimaryButton type="submit" disabled={isSaving}>
                                    {isSaving ? "Criando..." : "Criar feriado"}
                                </S.PrimaryButton>
                            </S.ModalActions>
                        </form>
                    </S.ModalBox>
                </S.ModalOverlay>
            )}
        </S.Section>
    );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function Admin() {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <S.Container>
            <S.PageHeader>
                <S.Title>Painel administrativo</S.Title>
                <S.Description>
                    Gerencie reservas, campanhas promocionais e feriados do sistema.
                </S.Description>
            </S.PageHeader>

            <S.TabBar>
                {TABS.map((tab) => (
                    <S.Tab
                        key={tab.key}
                        $active={activeTab === tab.key}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </S.Tab>
                ))}
            </S.TabBar>

            <S.TabPanel $active>
                {activeTab === "dashboard" && <DashboardTab />}
                {activeTab === "reservations" && <ReservationsTab />}
                {activeTab === "campaigns" && <CampaignsTab />}
                {activeTab === "holidays" && <HolidaysTab />}
            </S.TabPanel>
        </S.Container>
    );
}
