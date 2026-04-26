import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { listVenues, updateVenue } from "../../../services/venue";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import * as S from "../styles";

const EMPTY_FORM = {
    name: "",
    description: "",
    capacity: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    hasKidsArea: false,
    kidsAreaPricePerHour: "",
    hasPool: false,
    poolPricePerDay: "",
};

function parseLocation(location) {
    if (!location) return { rua: "", numero: "", bairro: "", cidade: "", estado: "", cep: "" };

    // Expected format: "Rua X, 21 - Bairro Y, Cidade - UF, 00000-000"
    try {
        const cepMatch = location.match(/(\d{5}-\d{3})\s*$/);
        const cep = cepMatch ? cepMatch[1] : "";
        const withoutCep = cep ? location.slice(0, location.lastIndexOf(cep)).replace(/,\s*$/, "").trim() : location;

        const parts = withoutCep.split(",").map((s) => s.trim());

        // parts[0] = "Rua X" or "Rua X, 21" if no separator
        // parts[1] = "21 - Bairro Y" or "Bairro Y"
        // parts[2] = "Cidade - UF" or "Cidade"

        let rua = "", numero = "", bairro = "", cidade = "", estado = "";

        if (parts.length >= 1) {
            const ruaNumero = parts[0].split(/,\s*/);
            rua = ruaNumero[0]?.trim() || "";
        }

        if (parts.length >= 2) {
            const numBairro = parts[1].split(" - ");
            if (numBairro.length >= 2) {
                numero = numBairro[0].trim();
                bairro = numBairro.slice(1).join(" - ").trim();
            } else {
                // might be just bairro or numero
                const val = parts[1].trim();
                if (/^\d+/.test(val)) numero = val;
                else bairro = val;
            }
        }

        if (parts.length >= 3) {
            const cidadeEstado = parts[2].split(" - ");
            cidade = cidadeEstado[0]?.trim() || "";
            estado = cidadeEstado[1]?.trim() || "";
        }

        return { rua, numero, bairro, cidade, estado, cep };
    } catch {
        return { rua: location, numero: "", bairro: "", cidade: "", estado: "", cep: "" };
    }
}

function buildLocation({ rua, numero, bairro, cidade, estado, cep }) {
    const parts = [];
    const ruaNumero = [rua, numero].filter(Boolean).join(", ");
    if (ruaNumero) parts.push(ruaNumero);
    if (bairro) parts[parts.length - 1] += ` - ${bairro}`;
    const cidadeEstado = [cidade, estado].filter(Boolean).join(" - ");
    if (cidadeEstado) parts.push(cidadeEstado);
    if (cep) parts.push(cep);
    return parts.join(", ");
}

function venueToForm(v) {
    const addr = parseLocation(v.location);
    return {
        name: v.name ?? "",
        description: v.description ?? "",
        capacity: v.capacity ?? "",
        ...addr,
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
            const location = buildLocation(form) || null;
            const payload = {
                name: form.name,
                description: form.description || null,
                capacity: Number(form.capacity),
                location,
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

    const locationPreview = buildLocation(form);

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
                        style={{ maxWidth: 540, maxHeight: "90vh", overflowY: "auto" }}
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

                            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: "var(--text-muted)" }}>ENDEREÇO</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    <S.FormGroup>
                                        <label>Rua</label>
                                        <S.TextInput {...field("rua")} placeholder="Ex: Rua Bernadino Antônio Tomás" />
                                    </S.FormGroup>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                        <S.FormGroup>
                                            <label>Número</label>
                                            <S.TextInput {...field("numero")} placeholder="Ex: 21" />
                                        </S.FormGroup>
                                        <S.FormGroup>
                                            <label>CEP</label>
                                            <S.TextInput {...field("cep")} placeholder="Ex: 37203-775" />
                                        </S.FormGroup>
                                    </div>
                                    <S.FormGroup>
                                        <label>Bairro</label>
                                        <S.TextInput {...field("bairro")} placeholder="Ex: Jardim Vila Rica" />
                                    </S.FormGroup>
                                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
                                        <S.FormGroup>
                                            <label>Cidade</label>
                                            <S.TextInput {...field("cidade")} placeholder="Ex: Lavras" />
                                        </S.FormGroup>
                                        <S.FormGroup>
                                            <label>Estado (UF)</label>
                                            <S.TextInput {...field("estado")} placeholder="Ex: MG" maxLength={2} />
                                        </S.FormGroup>
                                    </div>
                                    {locationPreview && (
                                        <p style={{ fontSize: 12, color: "var(--text-muted)", background: "var(--bg-muted)", padding: "8px 10px", borderRadius: 6 }}>
                                            Endereço gerado: <strong>{locationPreview}</strong>
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 10, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>COMODIDADES</p>
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
                                        <S.TextInput required type="number" min="0" step="0.01" {...field("kidsAreaPricePerHour")} placeholder="Ex: 30" />
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
                                        <S.TextInput required type="number" min="0" step="0.01" {...field("poolPricePerDay")} placeholder="Ex: 0" />
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
