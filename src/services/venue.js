import api from "./api";

export async function listVenues(signal) {
    const { data } = await api.get("/venues", { signal });
    return data.data || [];
}

export async function getVenue(venueId, signal) {
    const { data } = await api.get(`/venues/${venueId}`, { signal });
    return data.data;
}
