/**
 * @module hooks/useReservations
 * @description Hook para buscar e gerenciar as reservas do usuário autenticado.
 */
import { listReservations } from "../services/reservation";
import { useApiData } from "./useApiData";

/**
 * Busca as reservas do usuário via `GET /reservations`.
 * Cancela a requisição automaticamente ao desmontar o componente.
 *
 * @returns {{ reservations: Array, isLoading: boolean, refresh: Function }}
 */
export function useReservations() {
    const { data: reservations, isLoading, refresh } = useApiData(listReservations, {
        initialData: [],
        errorMessage: "Erro ao carregar reservas.",
    });

    return { reservations, isLoading, refresh };
}
