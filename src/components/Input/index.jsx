import * as S from "./styles";

export default function Input({
    label,
    error,
    ...props
}) {
    return (
        <S.Container>
            {label && <S.Label>{label}</S.Label>}

            <S.Input {...props} $error={!!error} />

            {error && <S.Error>{error}</S.Error>}
        </S.Container>
    );
}