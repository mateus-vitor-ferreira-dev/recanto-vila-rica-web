import { useEffect, useRef, useState } from "react";
import { formatPhone } from "../../utils/formatPhone";
import * as S from "./styles";

const COUNTRIES = [
    { code: "BR", flag: "🇧🇷", dialCode: "+55", name: "Brasil" },
    { code: "PT", flag: "🇵🇹", dialCode: "+351", name: "Portugal" },
    { code: "AO", flag: "🇦🇴", dialCode: "+244", name: "Angola" },
    { code: "MZ", flag: "🇲🇿", dialCode: "+258", name: "Moçambique" },
    { code: "AR", flag: "🇦🇷", dialCode: "+54", name: "Argentina" },
    { code: "BO", flag: "🇧🇴", dialCode: "+591", name: "Bolívia" },
    { code: "CA", flag: "🇨🇦", dialCode: "+1", name: "Canadá" },
    { code: "CL", flag: "🇨🇱", dialCode: "+56", name: "Chile" },
    { code: "CO", flag: "🇨🇴", dialCode: "+57", name: "Colômbia" },
    { code: "DE", flag: "🇩🇪", dialCode: "+49", name: "Alemanha" },
    { code: "ES", flag: "🇪🇸", dialCode: "+34", name: "Espanha" },
    { code: "FR", flag: "🇫🇷", dialCode: "+33", name: "França" },
    { code: "GB", flag: "🇬🇧", dialCode: "+44", name: "Reino Unido" },
    { code: "IT", flag: "🇮🇹", dialCode: "+39", name: "Itália" },
    { code: "JP", flag: "🇯🇵", dialCode: "+81", name: "Japão" },
    { code: "MX", flag: "🇲🇽", dialCode: "+52", name: "México" },
    { code: "PE", flag: "🇵🇪", dialCode: "+51", name: "Peru" },
    { code: "PY", flag: "🇵🇾", dialCode: "+595", name: "Paraguai" },
    { code: "UY", flag: "🇺🇾", dialCode: "+598", name: "Uruguai" },
    { code: "US", flag: "🇺🇸", dialCode: "+1", name: "Estados Unidos" },
    { code: "VE", flag: "🇻🇪", dialCode: "+58", name: "Venezuela" },
];

const DEFAULT_COUNTRY = COUNTRIES[0]; // Brasil

export default function PhoneInput({ label, name, value, onChange, onDialCodeChange, error }) {
    const [country, setCountry] = useState(DEFAULT_COUNTRY);
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef(null);
    const searchRef = useRef(null);

    useEffect(() => {
        onDialCodeChange?.(DEFAULT_COUNTRY.dialCode);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        searchRef.current?.focus();

        function handleClickOutside(e) {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
                setSearch("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    function handleSelectCountry(selected) {
        setCountry(selected);
        setIsOpen(false);
        setSearch("");
        onDialCodeChange?.(selected.dialCode);
    }

    function handlePhoneChange(e) {
        const formatted = country.code === "BR"
            ? formatPhone(e.target.value)
            : e.target.value.replace(/[^\d\s\-().+]/g, "").slice(0, 20);

        onChange({ target: { name, value: formatted } });
    }

    const filtered = COUNTRIES.filter(
        (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.dialCode.includes(search)
    );

    const placeholder = country.code === "BR" ? "(11) 99999-9999" : "Número de telefone";

    return (
        <S.Container ref={containerRef}>
            {label && <S.Label>{label}</S.Label>}

            <S.InputWrapper $error={!!error}>
                <S.CountryButton
                    type="button"
                    onClick={() => setIsOpen((o) => !o)}
                    aria-label="Selecionar país"
                    aria-expanded={isOpen}
                >
                    <S.Flag>{country.flag}</S.Flag>
                    <S.DialCode>{country.dialCode}</S.DialCode>
                    <S.Chevron $open={isOpen}>▼</S.Chevron>
                </S.CountryButton>

                <S.Divider />

                <S.PhoneNumberInput
                    inputMode="tel"
                    name={name}
                    value={value}
                    onChange={handlePhoneChange}
                    placeholder={placeholder}
                />
            </S.InputWrapper>

            {error && <S.Error>{error}</S.Error>}

            {isOpen && (
                <S.Dropdown>
                    <S.SearchInput
                        ref={searchRef}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar país..."
                    />
                    <S.List>
                        {filtered.map((c) => (
                            <S.ListItem
                                key={c.code}
                                $selected={c.code === country.code}
                                onClick={() => handleSelectCountry(c)}
                            >
                                <S.Flag>{c.flag}</S.Flag>
                                <S.CountryName>{c.name}</S.CountryName>
                                <S.DialCode>{c.dialCode}</S.DialCode>
                            </S.ListItem>
                        ))}
                    </S.List>
                </S.Dropdown>
            )}
        </S.Container>
    );
}
