import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { FADE_UP } from "../../utils/animations";
import * as S from "./styles";

export default function PaymentCancel() {
    const navigate = useNavigate();
    const cardRef = useRef(null);

    useGSAP(() => {
        const children = cardRef.current.children;
        gsap.from(children[0], { scale: 0.5, opacity: 0, duration: 0.6, ease: "back.out(1.7)" });
        gsap.from(Array.from(children).slice(1), { ...FADE_UP, stagger: 0.1, delay: 0.3 });
    }, { scope: cardRef, dependencies: [] });

    return (
        <S.Container>
            <S.Card ref={cardRef}>
                <S.IconWrapper>
                    <S.XIcon />
                </S.IconWrapper>

                <S.Title>Pagamento cancelado</S.Title>

                <S.Description>
                    Você cancelou o processo de pagamento. Não se preocupe — sua reserva
                    ainda está pendente e pode ser paga a qualquer momento.
                </S.Description>

                <S.Actions>
                    <S.PrimaryButton onClick={() => navigate("/reservations")}>
                        Ver minhas reservas
                    </S.PrimaryButton>

                    <S.SecondaryButton onClick={() => navigate("/venues")}>
                        Explorar espaços
                    </S.SecondaryButton>
                </S.Actions>
            </S.Card>
        </S.Container>
    );
}
