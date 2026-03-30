import * as S from "./styles";

export function Button({ children, ...props }) {
    return <S.Container {...props}>{children}</S.Container>;
}