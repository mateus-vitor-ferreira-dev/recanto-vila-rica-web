import { Outlet } from "react-router-dom";
import { ChatWidget, Footer, Header } from "..";
import * as S from "./styles";

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