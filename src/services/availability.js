import api from "./api";

export async function getBlockedDates(venueId, signal) {
    const { data } = await api.get("/blocked-dates", { params: { venueId }, signal });
    return data.data || [];
}

export async function getOccupiedDates(venueId, signal) {
    const { data } = await api.get("/reservations/occupied-dates", { params: { venueId }, signal });
    return data.data || [];
}
