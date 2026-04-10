import styled, { keyframes } from "styled-components";

const spinAnim = keyframes`
  to { transform: rotate(360deg); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Page shell ─── */

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 28px;
    animation: ${fadeUp} 0.35s ease;
`;

/* ─── Loading ─── */

export const LoadingState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    min-height: 320px;
    text-align: center;

    p {
        color: #6b7280;
        font-size: 15px;
    }
`;

export const Spinner = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid #e5e7eb;
    border-top-color: #1f4f41;
    animation: ${spinAnim} 0.8s linear infinite;
`;

/* ─── Page header ─── */

export const PageHeader = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
`;

export const HeaderLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export const Greeting = styled.h1`
    font-size: 30px;
    font-weight: 700;
    color: #111827;
    line-height: 1.2;

    span {
        color: #1f4f41;
    }
`;

export const Subgreeting = styled.p`
    font-size: 15px;
    color: #6b7280;
`;

export const NewReservationButton = styled.a`
    display: inline-flex;
    align-items: center;
    padding: 10px 20px;
    background: #1f4f41;
    color: #ffffff;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    transition: opacity 0.15s ease;

    &:hover {
        opacity: 0.9;
    }
`;

/* ─── Stats ─── */

export const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
    }
`;

export const StatCard = styled.article`
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-left: 4px solid ${({ $accent }) => $accent};
    border-radius: 14px;
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
    transition: box-shadow 0.15s ease;

    &:hover {
        box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
    }
`;

/*
  Paleta de acento acessível:
    #2563eb  — azul   (distinguível por daltônicos de todos os tipos)
    #7c3aed  — violeta (distinguível por todos os tipos)
    #ea580c  — laranja (distinguível por todos os tipos)
  Evita o par verde+vermelho/laranja, que é o problema mais comum (deuteranopia).
*/

export const StatLabel = styled.p`
    font-size: 12px;
    font-weight: 600;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.06em;
`;

export const StatNumber = styled.strong`
    display: block;
    font-size: 42px;
    font-weight: 800;
    color: ${({ $accent }) => $accent};
    line-height: 1;
    margin: 4px 0;
`;

export const StatDescription = styled.p`
    font-size: 13px;
    color: #6b7280;
    line-height: 1.4;
`;

/* ─── Quick action cards ─── */

export const ActionRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 680px) {
        grid-template-columns: 1fr;
    }
`;

export const ActionCard = styled.a`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 22px 24px;
    border-radius: 14px;
    text-decoration: none;
    cursor: pointer;
    transition: opacity 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

    background: ${({ $primary }) => ($primary ? "#1f4f41" : "#ffffff")};
    border: 1px solid ${({ $primary }) => ($primary ? "transparent" : "#e5e7eb")};
    box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);

    &:hover {
        opacity: ${({ $primary }) => ($primary ? "0.92" : "1")};
        background: ${({ $primary }) => ($primary ? "#1f4f41" : "#f9fafb")};
        box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
    }
`;

export const ActionContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`;

export const ActionTitle = styled.strong`
    display: block;
    font-size: 15px;
    font-weight: 700;
    color: inherit;
`;

export const ActionDesc = styled.p`
    font-size: 13px;
    color: inherit;
    opacity: 0.72;
`;

export const ActionArrow = styled.span`
    font-size: 28px;
    line-height: 1;
    color: ${({ $primary }) => ($primary ? "rgba(255,255,255,0.7)" : "#9ca3af")};
    flex-shrink: 0;
    transition: transform 0.15s ease;

    ${ActionCard}:hover & {
        transform: translateX(3px);
    }
`;

/* ─── Content panels ─── */

export const ContentGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
    }
`;

export const Panel = styled.article`
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
`;

export const PanelHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
`;

export const PanelTitle = styled.h2`
    font-size: 15px;
    font-weight: 700;
    color: #111827;
`;

export const PanelLink = styled.a`
    font-size: 13px;
    font-weight: 600;
    color: #1f4f41;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
    }
`;

/* ─── List ─── */

export const List = styled.ul`
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
`;

export const ListItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;

    &:last-child {
        border-bottom: none;
        padding-bottom: 0;
    }
`;

export const ListItemMain = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
`;

export const ListItemTitle = styled.strong`
    font-size: 14px;
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const ListItemSub = styled.span`
    font-size: 12px;
    color: #9ca3af;
`;

/* ─── Chips ─── */

const CHIP_COLORS = {
    green: { bg: "#ecfdf3", text: "#166534", border: "#bbf7d0" },
    amber: { bg: "#fffbeb", text: "#92400e", border: "#fde68a" },
    red:   { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
    gray:  { bg: "#f3f4f6", text: "#4b5563", border: "#e5e7eb" },
};

export const StatusChip = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    border: 1px solid;
    flex-shrink: 0;

    background: ${({ $color }) => CHIP_COLORS[$color]?.bg ?? CHIP_COLORS.gray.bg};
    color: ${({ $color }) => CHIP_COLORS[$color]?.text ?? CHIP_COLORS.gray.text};
    border-color: ${({ $color }) => CHIP_COLORS[$color]?.border ?? CHIP_COLORS.gray.border};
`;

export const PriceChip = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    background: #f0fdf9;
    color: #1f4f41;
    border: 1px solid #d1fae5;
    flex-shrink: 0;
`;

export const DiscountChip = styled.span`
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
    background: #ecfdf3;
    color: #166534;
    border: 1px solid #bbf7d0;
    flex-shrink: 0;
`;

/* ─── Empty state ─── */

export const EmptyState = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 0;

    span {
        font-size: 14px;
        color: #9ca3af;
    }
`;

export const EmptyDot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #e5e7eb;
    flex-shrink: 0;
`;
