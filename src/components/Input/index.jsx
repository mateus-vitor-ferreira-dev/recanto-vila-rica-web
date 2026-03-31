import * as S from "./styles";

export default function Input({ label, ...props }) {
    return (
        <S.Wrapper>
            <S.Label>{label}</S.Label>
            <S.Field {...props} />
        </S.Wrapper>
    );
}