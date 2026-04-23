import { Outlet } from "react-router-dom";
import { ChatWidget, Footer, Header } from "..";
import * as S from "./styles";

/**
 * Shell principal da aplicação autenticada.
 *
 * Renderiza `Header` no topo, o conteúdo da rota atual via `<Outlet>` no meio,
 * `Footer` no rodapé e o `ChatWidget` flutuante sobreposto.
 *
 * @component
 */
export default function MainLayout() {
    return (
        <S.Container>
            <Header />
            <S.Main>
                <Outlet />
            </S.Main>
            <Footer />
            <ChatWidget />
        </S.Container>
    );
}