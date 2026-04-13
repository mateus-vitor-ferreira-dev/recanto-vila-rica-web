import Logo from "../../assets/logo-recanto.svg";
import * as S from "./styles";

export default function AuthLayout({ title, subtitle, children }) {
    return (
        <S.Container>
            <S.LeftSide>
                <S.LeftInner>
                    <S.Brand>
                        <S.BrandName>Recanto Vila Rica</S.BrandName>
                        <S.BrandLogo src={Logo} alt="Recanto Vila Rica" />
                    </S.Brand>

                    <S.LeftBody>
                        <S.Headline>Reserve com elegância e simplicidade.</S.Headline>
                        <S.Tagline>
                            Uma experiência profissional para organizar eventos, pagamentos
                            e disponibilidade em um só lugar.
                        </S.Tagline>
                    </S.LeftBody>
                </S.LeftInner>

                <S.Deco1 />
                <S.Deco2 />
                <S.Deco3 />
            </S.LeftSide>

            <S.RightSide>
                <S.FormArea>
                    <S.FormHeader>
                        <S.Title>{title}</S.Title>
                        <S.Subtitle>{subtitle}</S.Subtitle>
                    </S.FormHeader>

                    {children}
                </S.FormArea>
            </S.RightSide>
        </S.Container>
    );
}
