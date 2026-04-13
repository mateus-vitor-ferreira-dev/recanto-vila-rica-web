import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo-recanto.svg";
import * as S from "./styles";

function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return (first + last).toUpperCase();
}

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
                <S.BrandWrapper to="/home">
                    <S.Logo src={logo} alt="Logo Recanto Vila Rica" />
                    <S.BrandText>Recanto Vila Rica</S.BrandText>
                </S.BrandWrapper>

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

                    <S.NavLink
                        $active={location.pathname === "/referrals"}
                        as={Link}
                        to="/referrals"
                    >
                        Indicações
                    </S.NavLink>

                    {userRole === "ADMIN" && (
                        <S.NavLink $active={location.pathname === "/admin"} as={Link} to="/admin">
                            Admin
                        </S.NavLink>
                    )}
                </S.Nav>

                <S.Actions>
                    <S.ProfileLink to="/profile" title={`Editar perfil de ${userName}`}>
                        <S.Avatar>{getInitials(userName)}</S.Avatar>
                        <S.UserInfo>
                            <span>Olá,</span>
                            <strong>{userName.split(" ")[0]}</strong>
                        </S.UserInfo>
                    </S.ProfileLink>

                    <S.LogoutButton onClick={handleLogout}>Sair</S.LogoutButton>
                </S.Actions>
            </S.Content>
        </S.Container>
    );
}
