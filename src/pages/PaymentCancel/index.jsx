import { useNavigate } from "react-router-dom";
import * as S from "./styles";

export default function PaymentCancel() {
    const navigate = useNavigate();

    return (
        <S.Container>
            <S.Card>
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
