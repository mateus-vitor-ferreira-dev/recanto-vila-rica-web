import { translateApiMessage } from "./translateApiMessage";

export function getErrorMessage(error, fallback = "Ocorreu um erro inesperado.") {
    const rawMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        error?.message ||
        fallback;

    return translateApiMessage(rawMessage);
}