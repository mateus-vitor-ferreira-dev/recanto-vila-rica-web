import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 32px;
`;

export const LoadingCard = styled.div`
    background: #ffffff;
    border-radius: 20px;
    padding: 32px;
    border: 1px solid #eef2f7;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);

    h2 {
        margin-bottom: 8px;
        color: #111827;
    }

    p {
        color: #6b7280;
    }
`;

export const HeroSection = styled.section`
    background: linear-gradient(135deg, #1f4f41 0%, #2f6b59 100%);
    border-radius: 24px;
    padding: 40px;
    color: #ffffff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
`;

export const Badge = styled.span`
    display: inline-block;
    background: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 18px;
`;

export const Title = styled.h1`
    font-size: 40px;
    font-weight: 700;
    margin-bottom: 16px;

    span {
        color: #d8f3e8;
    }
`;

export const Description = styled.p`
    max-width: 700px;
    font-size: 17px;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.92);
`;

export const CardsGrid = styled.section`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

export const Card = styled.article`
    background: #ffffff;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
    border: 1px solid #eef2f7;
`;

export const CardTitle = styled.h2`
    font-size: 16px;
    font-weight: 600;
    color: #4b5563;
    margin-bottom: 14px;
`;

export const CardValue = styled.strong`
    display: block;
    font-size: 34px;
    color: #1f4f41;
    margin-bottom: 10px;
`;

export const CardText = styled.p`
    color: #6b7280;
    line-height: 1.5;
    font-size: 15px;
`;

export const ContentGrid = styled.section`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

export const Panel = styled.article`
    background: #ffffff;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
    border: 1px solid #eef2f7;
`;

export const PanelTitle = styled.h3`
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 14px;
`;

export const List = styled.ul`
    padding-left: 18px;
    color: #374151;
    line-height: 1.8;
`;

export const EmptyText = styled.p`
    color: #6b7280;
    line-height: 1.6;
`;