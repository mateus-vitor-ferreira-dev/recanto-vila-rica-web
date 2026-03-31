import * as S from "./styles";

export default function Button({ children, ...props }) {
    return <S.Container {...props}>{children}</S.Container>;
}