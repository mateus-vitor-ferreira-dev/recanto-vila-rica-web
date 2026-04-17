export const PLAN_LABELS = {
    PROMOCIONAL: "Promocional",
    ESSENCIAL: "Essencial",
    COMPLETA: "Completa",
};

export function formatDate(date) {
    return new Date(date).toLocaleDateString("pt-BR");
}

export function formatDateFull(date) {
    return new Date(date).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function formatTime(date) {
    return new Date(date).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatCurrency(value) {
    return Number(value).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export function calcDuration(startDate, endDate) {
    const diffMs = new Date(endDate) - new Date(startDate);
    return Math.round(diffMs / (1000 * 60 * 60));
}
