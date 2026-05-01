/**
 * @module hooks/useNegotiations
 * @description Hook para buscar as negociações do usuário autenticado.
 */
import { listNegotiations } from "../services/negotiation";
import { useApiData } from "./useApiData";

/**
 * Busca as negociações do usuário via `GET /negotiations`.
 * Cancela a requisição automaticamente ao desmontar o componente.
 *
 * @returns {{ negotiations: Array, isLoading: boolean }}
 */
export function useNegotiations() {
    const { data: negotiations, isLoading } = useApiData(listNegotiations, {
        initialData: [],
        errorMessage: "Erro ao carregar negociações.",
    });

    return { negotiations, isLoading };
}
