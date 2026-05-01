/**
 * @module hooks/usePagination
 * @description Hook for paginated data fetching with AbortController and toast on error.
 *
 * fetchFn must accept (signal, { page, limit }) and return { data, meta }.
 * meta shape: { page, limit, total, totalPages }
 */
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { getErrorMessage } from "../utils/getErrorMessage";

/**
 * @template T
 * @param {(signal: AbortSignal, params: { page: number, limit: number }) => Promise<{ data: T[], meta: object }>} fetchFn
 * @param {{ limit?: number, errorMessage?: string }} [options]
 * @returns {{ data: T[], meta: object|null, isLoading: boolean, page: number, setPage: Function, refresh: Function }}
 */
export function usePagination(fetchFn, { limit = 10, errorMessage = "Erro ao carregar dados." } = {}) {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRef = useRef(fetchFn);
    fetchRef.current = fetchFn;

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        async function load() {
            try {
                setIsLoading(true);
                const result = await fetchRef.current(signal, { page, limit });
                if (!signal.aborted) {
                    setData(result.data);
                    setMeta(result.meta);
                }
            } catch (err) {
                if (err?.name === "CanceledError" || err?.name === "AbortError") return;
                toast.error(getErrorMessage(err, errorMessage));
            } finally {
                if (!signal.aborted) setIsLoading(false);
            }
        }

        load();
        return () => controller.abort();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, limit]);

    async function refresh() {
        try {
            setIsLoading(true);
            const result = await fetchRef.current(undefined, { page, limit });
            setData(result.data);
            setMeta(result.meta);
        } catch (err) {
            toast.error(getErrorMessage(err, errorMessage));
        } finally {
            setIsLoading(false);
        }
    }

    return { data, meta, isLoading, page, setPage, refresh };
}
