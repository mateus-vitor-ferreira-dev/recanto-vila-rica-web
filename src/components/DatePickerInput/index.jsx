import { forwardRef } from "react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./styles.css";
import * as InputS from "../Input/styles";

registerLocale("pt-BR", ptBR);

const CustomInput = forwardRef(({ value, onClick, onChange, placeholder, $error, name }, ref) => (
    <InputS.Input
        ref={ref}
        value={value}
        onClick={onClick}
        onChange={onChange}
        placeholder={placeholder}
        $error={$error}
        name={name}
        readOnly
    />
));

export default function DatePickerInput({
    label,
    name,
    value,
    onChange,
    error,
    placeholder = "dd/mm/aaaa",
    minDate,
    maxDate,
    ...props
}) {
    const selected = value ? new Date(value + "T12:00:00") : null;
    const parsedMin = minDate ? new Date(minDate + "T12:00:00") : undefined;
    const parsedMax = maxDate ? new Date(maxDate + "T12:00:00") : undefined;

    function handleChange(date) {
        const strValue = date ? date.toLocaleDateString("en-CA") : "";
        onChange({ target: { name, value: strValue } });
    }

    return (
        <InputS.Container>
            {label && <InputS.Label>{label}</InputS.Label>}
            <ReactDatePicker
                selected={selected}
                onChange={handleChange}
                dateFormat="dd/MM/yyyy"
                locale="pt-BR"
                placeholderText={placeholder}
                customInput={<CustomInput $error={!!error} name={name} />}
                minDate={parsedMin}
                maxDate={parsedMax}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                popperPlacement="bottom-start"
                {...props}
            />
            {error && <InputS.Error>{error}</InputS.Error>}
        </InputS.Container>
    );
}
