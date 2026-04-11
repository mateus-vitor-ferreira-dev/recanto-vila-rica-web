import { PDFDownloadLink } from "@react-pdf/renderer";
import { ContratoRVR } from "./index";

// Isolado em arquivo separado para que @react-pdf/renderer seja carregado em chunk lazy.
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
