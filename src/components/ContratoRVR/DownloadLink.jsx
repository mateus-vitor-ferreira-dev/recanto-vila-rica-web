import { PDFDownloadLink } from "@react-pdf/renderer";
import { ContratoRVR } from "./index";

/**
 * Link de download do contrato PDF do Recanto Vila Rica.
 *
 * Isolado em arquivo separado para que `@react-pdf/renderer` seja carregado em
 * chunk lazy, evitando incluir a biblioteca no bundle principal.
 *
 * @component
 * @param {object} props
 * @param {import("./index").ContratoRVRProps} props.contratoProps - Props repassadas para `ContratoRVR`
 * @param {string} props.fileName - Nome do arquivo PDF gerado (ex.: `"contrato-reserva.pdf"`)
 * @param {string} [props.className] - Classe CSS aplicada ao link
 * @param {React.CSSProperties} [props.style] - Estilos inline aplicados ao link
 */
export default function ContratoDownloadLink({ contratoProps, fileName, className, style }) {
    return (
        <PDFDownloadLink
            document={<ContratoRVR {...contratoProps} />}
            fileName={fileName}
            className={className}
            style={style}
        >
            {({ loading }) => (loading ? "Gerando contrato..." : "Baixar contrato em PDF")}
        </PDFDownloadLink>
    );
}
