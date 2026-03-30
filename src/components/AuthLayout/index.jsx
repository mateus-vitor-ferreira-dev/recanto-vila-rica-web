import * as S from "./styles";

export function AuthLayout({ title, subtitle, children }) {
    return (
        <S.Container>
            <S.LeftSide>
                <S.Brand>Recanto Vila Rica</S.Brand>
                <S.Headline>Reserve com elegância e simplicidade.</S.Headline>
                <S.Description>
                    Organize reservas, pagamentos e disponibilidade em uma experiência profissional.
                </S.Description>
            </S.LeftSide>

            <S.RightSide>
                <S.Card>
                    <S.Title>{title}</S.Title>
                    <S.Subtitle>{subtitle}</S.Subtitle>
                    {children}
                </S.Card>
            </S.RightSide>
        </S.Container>
    );
}