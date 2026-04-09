import api from "./api";

export async function listVenues() {
    const { data } = await api.get("/venues");
    return data.data || [];
}

export async function getVenue(venueId) {
    const { data } = await api.get(`/venues/${venueId}`);
    return data.data;
}
