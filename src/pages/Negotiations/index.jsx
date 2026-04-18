import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGSAP } from "@gsap/react";

import { createNegotiation, listNegotiations } from "../../services/negotiation";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { animateFadeInUp, animateStagger } from "../../utils/animations";
import * as S from "./styles";

const STATUS_LABELS = {
    OPEN: "Aberta",
    PENDING_APPROVAL: "Proposta enviada",
    ACCEPTED: "Aceita",
    REJECTED: "Recusada",
    CLOSED: "Encerrada",
};

function formatDate(date) {
    return new Date(date).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function Negotiations() {
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const [negotiations, setNegotiations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                setIsLoading(true);
                const data = await listNegotiations(controller.signal);
                setNegotiations(data ?? []);
            } catch (error) {
                if (error?.name === "CanceledError" || error?.name === "AbortError") return;
                toast.error(getErrorMessage(error, "Erro ao carregar negociações."));
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        }

        load();

        return () => controller.abort();
    }, []);

    useGSAP(() => {
        animateFadeInUp(containerRef.current.querySelector(".anim-header"));
        animateStagger(containerRef.current.querySelectorAll(".anim-card"), { delay: 0.1 });
    }, { scope: containerRef, dependencies: [] });

    async function handleCreate() {
        if (isSending) return;

        try {
            setIsSending(true);
            const negotiation = await createNegotiation();
            navigate(`/negociacoes/${negotiation.id}`);
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao iniciar negociação."));
        } finally {
            setIsSending(false);
        }
    }

    return (
        <S.Container ref={containerRef}>
            <S.Header className="anim-header">
                <S.Title>Negociações</S.Title>
                <S.Description>
                    Acompanhe suas conversas de negociação. Clique em uma para continuar.
                </S.Description>
            </S.Header>

            <S.NewButton onClick={handleCreate} disabled={isSending}>
                {isSending ? "Iniciando..." : "+ Nova negociação"}
            </S.NewButton>

            {isLoading ? (
                <S.LoadingCard>
                    <p>Carregando negociações...</p>
                </S.LoadingCard>
            ) : negotiations.length === 0 ? (
                <S.EmptyState>
                    <p>Você ainda não possui negociações.<br />Clique em "+ Nova negociação" para começar.</p>
                </S.EmptyState>
            ) : (
                <S.List>
                    {negotiations.map((neg) => (
                        <S.NegotiationCard
                            key={neg.id}
                            className="anim-card"
                            onClick={() => navigate(`/negociacoes/${neg.id}`)}
                        >
                            <S.NegotiationInfo>
                                <S.NegotiationSubject>{neg.subject}</S.NegotiationSubject>
                                <S.NegotiationMeta>
                                    {neg.user?.name} · {formatDate(neg.createdAt)}
                                </S.NegotiationMeta>
                                {neg.messages?.[0] && (
                                    <S.LastMessage>{neg.messages[0].content}</S.LastMessage>
                                )}
                            </S.NegotiationInfo>
                            <S.StatusBadge $status={neg.status}>
                                {STATUS_LABELS[neg.status] ?? neg.status}
                            </S.StatusBadge>
                        </S.NegotiationCard>
                    ))}
                </S.List>
            )}
        </S.Container>
    );
}
