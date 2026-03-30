import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import GoogleIcon from "../../assets/google-icon.png";
import api from "../../services/api";
import * as S from "./styles";

export function GoogleButton({ text, navigate }) {
    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const { data } = await api.post("/auth/google", {
                    access_token: tokenResponse.access_token,
                });

                localStorage.setItem("recanto:userData", JSON.stringify(data.data));

                toast.success(data.message || "Sucesso com Google");
                navigate("/home");
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    error.response?.data?.error?.message ||
                    "Erro ao autenticar com Google.";

                toast.error(message);
            }
        },
        onError: () => toast.error("Erro ao autenticar com Google."),
    });

    return (
        <S.GoogleBtn type="button" onClick={() => login()}>
            <img
                src={GoogleIcon}
                alt="Google"
            />
            {text}
        </S.GoogleBtn>
    );
}