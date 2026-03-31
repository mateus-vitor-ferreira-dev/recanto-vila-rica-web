import { Link, useLocation, useNavigate } from "react-router-dom";
import * as S from "./styles";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const userData = JSON.parse(localStorage.getItem("recanto:userData") || "{}");
    const userName = userData?.user?.name || userData?.name || "Usuário";
    const userRole = userData?.user?.role || userData?.role;

    function handleLogout() {
        localStorage.removeItem("recanto:userData");
        navigate("/login");
    }

    return (
        <S.Container>
            <S.Content>
                <S.Brand to="/home">Recanto Vila Rica</S.Brand>

                <S.Nav>
                    <S.NavLink $active={location.pathname === "/home"} as={Link} to="/home">
                        Início
                    </S.NavLink>

                    <S.NavLink $active={location.pathname === "/venues"} as={Link} to="/venues">
                        Espaços
                    </S.NavLink>

                    <S.NavLink
                        $active={location.pathname === "/reservations"}
                        as={Link}
                        to="/reservations"
                    >
                        Reservas
                    </S.NavLink>

                    {userRole === "ADMIN" && (
                        <S.NavLink $active={location.pathname === "/admin"} as={Link} to="/admin">
                            Admin
                        </S.NavLink>
                    )}
                </S.Nav>

                <S.Actions>
                    <S.UserInfo>
                        <span>Olá,</span>
                        <strong>{userName}</strong>
                    </S.UserInfo>

                    <S.LogoutButton onClick={handleLogout}>
                        Sair
                    </S.LogoutButton>
                </S.Actions>
            </S.Content>
        </S.Container>
    );
}