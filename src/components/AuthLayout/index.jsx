import Logo from "../../assets/logo-recanto-vila-rica.png";
import * as S from "./styles";

const FEATURES = [
    "Reserve espaços para festas e eventos",
    "Pagamentos seguros processados pelo Stripe",
    "Acompanhe e gerencie todas as suas reservas",
];

export default function AuthLayout({ title, subtitle, children }) {
    return (
        <S.Container>
            <S.LeftSide>
                <S.LeftInner>
                    <S.Brand>
                        <S.BrandLogo src={Logo} alt="Recanto Vila Rica" />
                        <S.BrandName>Recanto Vila Rica</S.BrandName>
                    </S.Brand>

                    <S.LeftBody>
                        <S.Headline>Reserve com elegância e simplicidade.</S.Headline>
                        <S.Tagline>
                            Uma experiência profissional para organizar eventos, pagamentos
                            e disponibilidade em um só lugar.
                        </S.Tagline>

                        <S.FeatureList>
                            {FEATURES.map((f) => (
                                <S.FeatureItem key={f}>
                                    <S.FeatureDot />
                                    {f}
                                </S.FeatureItem>
                            ))}
                        </S.FeatureList>
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
