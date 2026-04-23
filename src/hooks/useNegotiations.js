/**
 * @module hooks/useNegotiations
 * @description Hook para buscar as negociações do usuário autenticado.
 */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { listNegotiations } from "../services/negotiation";
import { getErrorMessage } from "../utils/getErrorMessage";

/**
 * Busca as negociações do usuário via `GET /negotiations`.
 * Cancela a requisição automaticamente ao desmontar o componente.
 *
 * @returns {{ negotiations: Array, isLoading: boolean }}
 */
export function useNegotiations() {
    const [negotiations, setNegotiations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            try {
                setIsLoading(true);
                const data = await listNegotiations(controller.signal);
                if (!controller.signal.aborted) setNegotiations(data ?? []);
            } catch (error) {
                if (error?.name === "CanceledError" || error?.name === "AbortError") return;
                toast.error(getErrorMessage(error, "Erro ao carregar negociações."));
            } finally {
                if (!controller.signal.aborted) setIsLoading(false);
            }
        }

        load();
        return () => controller.abort();
    }, []);

    return { negotiations, isLoading };
}
