import { useState } from "react";
import { TABS } from "./tabs/constants";
import { DashboardTab } from "./tabs/DashboardTab";
import { ReservationsTab } from "./tabs/ReservationsTab";
import { NegotiationsTab } from "./tabs/NegotiationsTab";
import { UsersTab } from "./tabs/UsersTab";
import { CampaignsTab } from "./tabs/CampaignsTab";
import { HolidaysTab } from "./tabs/HolidaysTab";
import { BlockedDatesTab } from "./tabs/BlockedDatesTab";
import { PlansTab } from "./tabs/PlansTab";
import { VenueTab } from "./tabs/VenueTab";
import * as S from "./styles";

export default function Admin() {
    const [activeTab, setActiveTab] = useState("dashboard");

    return (
        <S.Container>
            <S.PageHeader>
                <S.Title>Painel Administrativo</S.Title>
                <S.Description>Gerencie reservas, usuários, campanhas e configurações.</S.Description>
            </S.PageHeader>

            <S.TabBar>
                {TABS.map((tab) => (
                    <S.Tab
                        key={tab.key}
                        $active={activeTab === tab.key}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        {tab.label}
                    </S.Tab>
                ))}
            </S.TabBar>

            <S.TabPanel $active>
                {activeTab === "dashboard" && <DashboardTab />}
                {activeTab === "reservations" && <ReservationsTab />}
                {activeTab === "negotiations" && <NegotiationsTab />}
                {activeTab === "users" && <UsersTab />}
                {activeTab === "campaigns" && <CampaignsTab />}
                {activeTab === "holidays" && <HolidaysTab />}
                {activeTab === "blockedDates" && <BlockedDatesTab />}
                {activeTab === "plans" && <PlansTab />}
                {activeTab === "venues" && <VenueTab />}
            </S.TabPanel>
        </S.Container>
    );
}
