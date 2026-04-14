import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import api from "../../services/api";
import * as S from "./styles";

async function handleGoogleSuccess({ credential }, navigate) {
    try {
        const { data } = await api.post("/auth/google", {
            id_token: credential,
        });

        localStorage.setItem("recanto:userData", JSON.stringify(data.data));
        toast.success(data.message || "Login realizado com sucesso.");
        navigate("/home");
    } catch (error) {
        const message =
            error.response?.data?.message || "Erro ao autenticar com Google.";

        toast.error(message);
    }
}

export default function GoogleButton({ navigate }) {
    return (
        <S.GoogleBtnWrapper>
            <GoogleLogin
                onSuccess={(credentialResponse) =>
                    handleGoogleSuccess(credentialResponse, navigate)
                }
                onError={() => toast.error("Erro ao autenticar com Google.")}
                width={400}
                theme="outline"
                shape="rectangular"
                size="large"
                text="signin_with"
                logo_alignment="left"
            />
        </S.GoogleBtnWrapper>
    );
}