/**
 * @module components/ErrorBoundary
 * @description Captura erros de renderização em subárvores React e exibe um fallback
 * em vez de quebrar a aplicação inteira.
 */
import { Component } from "react";
import { Sentry } from "../../config/sentry";

/**
 * React Error Boundary. Quando um descendente lança durante a renderização,
 * exibe `props.fallback` (ou nada, se omitido) em vez do subárvore quebrado.
 * Erros são reportados automaticamente ao Sentry quando configurado.
 *
 * @component
 * @param {object} props
 * @param {React.ReactNode} props.children - Subárvore monitorada
 * @param {React.ReactNode} [props.fallback] - UI exibida ao capturar um erro
 */
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        Sentry?.captureException?.(error, {
            extra: { componentStack: info.componentStack },
        });
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback ?? null;
        }
        return this.props.children;
    }
}
