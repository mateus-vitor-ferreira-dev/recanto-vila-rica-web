import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useGSAP } from "@gsap/react";

import { createReferral, listReferrals } from "../../services/referral";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { animateFadeInUp, animateStagger } from "../../utils/animations";
import * as S from "./styles";

/**
 * Página do programa de indicações.
 *
 * Exibe o histórico de indicações do usuário e permite indicar novos amigos por e-mail.
 * Quando o indicado faz sua primeira reserva, o indicador recebe um desconto
 * conforme a campanha de tipo `REFERRAL_NEXT_BOOKING` ativa.
 *
 * @see GET /referrals
 * @see POST /referrals
 * @component
 */
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
    const containerRef = useRef(null);
    const [referrals, setReferrals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [noCampaign, setNoCampaign] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                setIsLoading(true);
                const data = await listReferrals(controller.signal);
                setReferrals(data ?? []);
            } catch (error) {
                if (error?.name === "CanceledError" || error?.name === "AbortError") return;
                toast.error(getErrorMessage(error, "Erro ao carregar indicações."));
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        }

        load();

        return () => controller.abort();
    }, []);

    async function refreshReferrals() {
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

    async function handleInvite(e) {
        e.preventDefault();
        if (!email.trim()) return;

        try {
            setIsSending(true);
            setNoCampaign(false);
            await createReferral(email.trim());
            toast.success("Indicação enviada com sucesso!");
            setEmail("");
            refreshReferrals();
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

    useGSAP(() => {
        if (!containerRef.current) return;
        animateFadeInUp(containerRef.current.querySelector(".anim-header"));
        animateStagger(containerRef.current.querySelectorAll(".anim-card"), { delay: 0.1 });
    }, { scope: containerRef, dependencies: [] });

    return (
        <S.Container ref={containerRef}>
            <S.Header className="anim-header">
                <S.Title>Indicações</S.Title>
                <S.Description>
                    Indique amigos e ganhe descontos na sua próxima reserva quando eles fizerem a primeira deles.
                </S.Description>
            </S.Header>

            <S.InviteCard className="anim-card">
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
