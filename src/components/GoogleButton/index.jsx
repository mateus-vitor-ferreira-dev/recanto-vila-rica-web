import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";
import * as S from "./styles";

export default function GoogleButton({ navigate }) {
    const { login } = useAuth();

    async function handleGoogleSuccess({ credential }) {
        try {
            const { data } = await api.post("/auth/google", { id_token: credential });
            login(data.data);
            toast.success(data.message || "Sucesso com Google.");
            navigate("/home");
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error?.message ||
                "Erro ao autenticar com Google.";
            toast.error(message);
        }
    }

    return (
        <S.GoogleBtnWrapper>
            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Erro ao autenticar com Google.")}
                width={400}
                theme="outline"
                shape="rectangular"
                size="large"
                text="signin_with"
                logo_alignment="left"
                use_fedcm_for_prompt={false}
                cancel_on_tap_outside={false}
            />
        </S.GoogleBtnWrapper>
    );
}
