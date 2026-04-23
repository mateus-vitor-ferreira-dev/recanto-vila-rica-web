/**
 * @module components/Button
 * @description Botão primário do design system. Aplica os estilos do tema via
 * styled-component e repassa todos os atributos HTML ao elemento subjacente.
 */
import * as S from "./styles";

/**
 * Botão genérico do design system.
 *
 * @component
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement>} props - Props nativas de botão
 */
export default function Button({ children, ...props }) {
    return <S.Container {...props}>{children}</S.Container>;
}