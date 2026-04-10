import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { createReferral, listReferrals } from "../../services/referral";
import { getErrorMessage } from "../../utils/getErrorMessage";
import * as S from "./styles";

const STATUS_LABELS = {
    PENDING: "Aguardando",
    QUALIFIED: "Qualificado",
    REWARDED: "Recompensado",
    EXPIRED: "Expirado",
    CANCELLED: "Cancelado",
};

function formatDate(date) {
    return new Date(date).toLocaleDateString("pt-BR");
}

export default function Referrals() {
    const [referrals, setReferrals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [noCampaign, setNoCampaign] = useState(false);

    async function load() {
        try {
            setIsLoading(true);
            const data = await listReferrals();
            setReferrals(data ?? []);
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao carregar indicações."));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleInvite(e) {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            setIsSending(true);
            setNoCampaign(false);
            await createReferral(email.trim());
            toast.success("Indicação enviada com sucesso!");
            setEmail("");
            load();
        } catch (error) {
            if (error.response?.data?.error?.code === "NO_ACTIVE_REFERRAL_CAMPAIGN") {
                setNoCampaign(true);
            } else {
                toast.error(getErrorMessage(error, "Erro ao enviar indicação."));
            }
        } finally {
            setIsSending(false);
        }
    }

    return (
        <S.Container>
            <S.Header>
                <S.Title>Indicações</S.Title>
                <S.Description>
                    Indique amigos e ganhe descontos na sua próxima reserva quando eles fizerem a primeira deles.
                </S.Description>
            </S.Header>

            <S.InviteCard>
                <S.InviteTitle>Convidar um amigo</S.InviteTitle>

                {noCampaign && (
                    <S.NoCampaignBanner>
                        Não há uma campanha de indicação ativa no momento. Fique de olho — em breve novas promoções estarão disponíveis!
                    </S.NoCampaignBanner>
                )}

                <form onSubmit={handleInvite}>
                    <S.InviteRow>
                        <S.EmailInput
                            type="email"
                            placeholder="E-mail do amigo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSending}
                            required
                        />
                        <S.InviteButton type="submit" disabled={isSending || !email.trim()}>
                            {isSending ? "Enviando..." : "Indicar"}
                        </S.InviteButton>
                    </S.InviteRow>
                </form>
            </S.InviteCard>

            {isLoading ? (
                <S.LoadingCard>
                    <h2>Carregando indicações...</h2>
                    <p>Aguarde um momento.</p>
                </S.LoadingCard>
            ) : (
                <>
                    <S.ListTitle>Suas indicações</S.ListTitle>

                    {referrals.length === 0 ? (
                        <S.EmptyState>
                            <p>Você ainda não fez nenhuma indicação.<br />Convide um amigo usando o formulário acima.</p>
                        </S.EmptyState>
                    ) : (
                        <S.List>
                            {referrals.map((ref) => (
                                <S.ReferralCard key={ref.id}>
                                    <S.ReferralInfo>
                                        <strong>{ref.referredEmail}</strong>
                                        <span>
                                            {ref.campaign?.name} · Indicado em {formatDate(ref.createdAt)}
                                        </span>
                                    </S.ReferralInfo>

                                    <S.StatusBadge $status={ref.status}>
                                        {STATUS_LABELS[ref.status] ?? ref.status}
                                    </S.StatusBadge>
                                </S.ReferralCard>
                            ))}
                        </S.List>
                    )}
                </>
            )}
        </S.Container>
    );
}
