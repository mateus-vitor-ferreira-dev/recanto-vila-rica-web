import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { listVenues, updateVenue } from "../../../services/venue";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import * as S from "../styles";

const EMPTY_FORM = {
    name: "",
    description: "",
    capacity: "",
    location: "",
    hasKidsArea: false,
    kidsAreaPricePerHour: "",
    hasPool: false,
    poolPricePerDay: "",
};

function venueToForm(v) {
    return {
        name: v.name ?? "",
        description: v.description ?? "",
        capacity: v.capacity ?? "",
        location: v.location ?? "",
        hasKidsArea: v.hasKidsArea ?? false,
        kidsAreaPricePerHour: v.kidsAreaPricePerHour ?? "",
        hasPool: v.hasPool ?? false,
        poolPricePerDay: v.poolPricePerDay ?? "",
    };
}

export function VenueTab() {
    const [venues, setVenues] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingVenue, setEditingVenue] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);

    async function load() {
        try {
            setIsLoading(true);
            const data = await listVenues();
            setVenues(data ?? []);
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao carregar espaços."));
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    function openEdit(venue) {
        setEditingVenue(venue);
        setForm(venueToForm(venue));
        setShowModal(true);
    }

    function field(key) {
        return {
            value: form[key],
            onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
        };
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setIsSaving(true);
            const payload = {
                name: form.name,
                description: form.description || null,
                capacity: Number(form.capacity),
                location: form.location || null,
                hasKidsArea: form.hasKidsArea,
                kidsAreaPricePerHour: form.hasKidsArea && form.kidsAreaPricePerHour !== ""
                    ? Number(form.kidsAreaPricePerHour)
                    : null,
                hasPool: form.hasPool,
                poolPricePerDay: form.hasPool && form.poolPricePerDay !== ""
                    ? Number(form.poolPricePerDay)
                    : null,
            };
            await updateVenue(editingVenue.id, payload);
            toast.success("Espaço atualizado com sucesso.");
            setShowModal(false);
            load();
        } catch (error) {
            toast.error(getErrorMessage(error, "Erro ao salvar espaço."));
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <S.Section>
            <S.SectionHeader>
                <S.SectionTitle>Espaços</S.SectionTitle>
            </S.SectionHeader>

            {isLoading ? (
                <S.LoadingSpinner />
            ) : venues.length === 0 ? (
                <S.EmptyState>
                    <h3>Nenhum espaço cadastrado</h3>
                </S.EmptyState>
            ) : (
                <S.TableWrapper>
                    <S.Table>
                        <thead>
                            <tr>
                                <S.Th>Nome</S.Th>
                                <S.Th>Capacidade</S.Th>
                                <S.Th>Localização</S.Th>
                                <S.Th>Área Kids</S.Th>
                                <S.Th>Piscina</S.Th>
                                <S.Th></S.Th>
                            </tr>
                        </thead>
                        <tbody>
                            {venues.map((v) => (
                                <S.Tr key={v.id}>
                                    <S.Td><strong>{v.name}</strong></S.Td>
                                    <S.Td>{v.capacity} pessoas</S.Td>
                                    <S.Td>{v.location || "—"}</S.Td>
                                    <S.Td>{v.hasKidsArea ? "Sim" : "Não"}</S.Td>
                                    <S.Td>{v.hasPool ? "Sim" : "Não"}</S.Td>
                                    <S.Td>
                                        <S.SecondaryButton
                                            style={{ height: "30px", padding: "0 10px", fontSize: "12px" }}
                                            onClick={() => openEdit(v)}
                                        >
                                            Editar
                                        </S.SecondaryButton>
                                    </S.Td>
                                </S.Tr>
                            ))}
                        </tbody>
                    </S.Table>
                </S.TableWrapper>
            )}

            {showModal && (
                <S.ModalOverlay onClick={() => setShowModal(false)}>
                    <S.ModalBox
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }}
                    >
                        <S.ModalTitle>Editar espaço</S.ModalTitle>
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            <S.FormGroup>
                                <label>Nome</label>
                                <S.TextInput required {...field("name")} placeholder="Nome do espaço" />
                            </S.FormGroup>
                            <S.FormGroup>
                                <label>Descrição</label>
                                <S.TextInput {...field("description")} placeholder="Descrição (opcional)" />
                            </S.FormGroup>
                            <S.FormGroup>
                                <label>Capacidade (pessoas)</label>
                                <S.TextInput required type="number" min="1" {...field("capacity")} placeholder="Ex: 100" />
                            </S.FormGroup>
                            <S.FormGroup>
                                <label>Localização</label>
                                <S.TextInput
                                    {...field("location")}
                                    placeholder="Ex: Rua Bernardino Antônio Tomás, 21 - Jardim Vila Rica, Lavras - MG"
                                />
                            </S.FormGroup>

                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={form.hasKidsArea}
                                        onChange={(e) => setForm((f) => ({ ...f, hasKidsArea: e.target.checked }))}
                                    />
                                    Possui área kids
                                </label>
                                {form.hasKidsArea && (
                                    <S.FormGroup>
                                        <label>Preço da área kids (R$/hora)</label>
                                        <S.TextInput
                                            required
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            {...field("kidsAreaPricePerHour")}
                                            placeholder="Ex: 30"
                                        />
                                    </S.FormGroup>
                                )}

                                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                                    <input
                                        type="checkbox"
                                        checked={form.hasPool}
                                        onChange={(e) => setForm((f) => ({ ...f, hasPool: e.target.checked }))}
                                    />
                                    Possui piscina
                                </label>
                                {form.hasPool && (
                                    <S.FormGroup>
                                        <label>Preço da piscina (R$/dia)</label>
                                        <S.TextInput
                                            required
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            {...field("poolPricePerDay")}
                                            placeholder="Ex: 0"
                                        />
                                    </S.FormGroup>
                                )}
                            </div>

                            <S.ModalActions>
                                <S.SecondaryButton type="button" onClick={() => setShowModal(false)} disabled={isSaving}>
                                    Cancelar
                                </S.SecondaryButton>
                                <S.PrimaryButton type="submit" disabled={isSaving}>
                                    {isSaving ? "Salvando..." : "Salvar alterações"}
                                </S.PrimaryButton>
                            </S.ModalActions>
                        </form>
                    </S.ModalBox>
                </S.ModalOverlay>
            )}
        </S.Section>
    );
}
