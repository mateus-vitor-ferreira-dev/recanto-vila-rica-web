import styled from "styled-components";

export const Container = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftSide = styled.div`
  background: linear-gradient(180deg, #1f4f41 0%, #173d32 100%);
  color: white;
  padding: 64px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const Brand = styled.h2`
  font-size: 28px;
  margin-bottom: 24px;
`;

export const Headline = styled.h1`
  font-size: 42px;
  line-height: 1.1;
  max-width: 420px;
  margin-bottom: 16px;
`;

export const Description = styled.p`
  font-size: 16px;
  line-height: 1.6;
  max-width: 420px;
  color: rgba(255, 255, 255, 0.85);
`;

export const RightSide = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 30px rgba(16, 24, 40, 0.08);
`;

export const Title = styled.h2`
  font-size: 28px;
  margin-bottom: 8px;
`;

export const Subtitle = styled.p`
  color: #6b7280;
  margin-bottom: 24px;
`;