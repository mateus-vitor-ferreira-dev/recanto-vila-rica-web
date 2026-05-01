export const STATUS_MAP = {
    PENDING: { label: "Pendente", color: "amber" },
    PAID: { label: "Pago", color: "green" },
    CANCELLED: { label: "Cancelado", color: "red" },
    EXPIRED: { label: "Expirado", color: "gray" },
};

export const REFUND_TIERS = [
    { minDays: 181, percentage: 100, label: "Mais de 180 dias antes do evento" },
    { minDays: 121, percentage: 70,  label: "De 121 a 180 dias antes do evento" },
    { minDays: 61,  percentage: 40,  label: "De 61 a 120 dias antes do evento" },
    { minDays: 0,   percentage: 0,   label: "Até 60 dias antes do evento" },
];

export function getRefundPercentage(daysBeforeEvent) {
    for (const tier of REFUND_TIERS) {
        if (daysBeforeEvent >= tier.minDays) return tier.percentage;
    }
    return 0;
}

export const PLANS = [
    { code: "PROMOCIONAL", label: "Promocional", days: "Segunda a Quinta (não feriados)", priceCents: 65000 },
    { code: "ESSENCIAL",   label: "Essencial",   days: "Sexta a Domingo e feriados",      priceCents: 85000 },
    { code: "COMPLETA",    label: "Completa",     days: "Sexta a Domingo e feriados",      priceCents: 100000 },
];
