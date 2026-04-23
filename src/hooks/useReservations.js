/**
 * @module hooks/useReservations
 * @description Hook para buscar e gerenciar as reservas do usuário autenticado.
 */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { listReservations } from "../services/reservation";
import { getErrorMessage } from "../utils/getErrorMessage";

/**
 * Busca as reservas do usuário via `GET /reservations`.
 * Cancela a requisição automaticamente ao desmontar o componente.
 *
 * @returns {{ reservations: Array, isLoading: boolean, refresh: Function }}
 */
export function useReservations() {
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                setIsLoading(true);
                const data = await listReservations(controller.signal);
                if (!controller.signal.aborted) setReservations(data);
            } catch (error) {
                if (error.name === "CanceledError" || error.name === "AbortError") return;
                toast.error(getErrorMessage(error, "Erro ao carregar reservas."));
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        }

        load();
        return () => controller.abort();
    }, []);

    async function refresh() {
        try {
            const data = await listReservations();
            setReservations(data);
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao atualizar reservas."));
        }
    }

    return { reservations, isLoading, refresh };
}
