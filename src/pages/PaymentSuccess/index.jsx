import { useNavigate } from "react-router-dom";
import * as S from "./styles";

export default function PaymentSuccess() {
    const navigate = useNavigate();

    return (
        <S.Container>
            <S.Card>
                <S.IconWrapper>
                    <S.CheckIcon />
                </S.IconWrapper>

                <S.Title>Pagamento confirmado!</S.Title>

                <S.Description>
                    Sua reserva foi confirmada com sucesso. Em breve você receberá
                    um e-mail com os detalhes do seu evento.
                </S.Description>

                <S.Actions>
                    <S.PrimaryButton onClick={() => navigate("/reservations")}>
                        Ver minhas reservas
                    </S.PrimaryButton>

                    <S.SecondaryButton onClick={() => navigate("/home")}>
                        Voltar para o início
                    </S.SecondaryButton>
                </S.Actions>
            </S.Card>
        </S.Container>
    );
}
