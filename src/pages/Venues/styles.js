import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const Header = styled.section`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.h1`
  font-size: 34px;
  font-weight: 700;
  color: #111827;
`;

export const Description = styled.p`
  color: #6b7280;
  font-size: 16px;
  line-height: 1.6;
  max-width: 680px;
`;

export const Counter = styled.span`
  background: #ecfdf3;
  color: #1f4f41;
  border: 1px solid #d1fae5;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
`;

export const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.article`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 24px;
`;

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

export const CardTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
`;

export const Price = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: #1f4f41;
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;

  span {
    font-size: 12px;
    color: #6b7280;
    font-weight: 600;
  }
`;

export const PlansTag = styled.div`
  background: #ecfdf3;
  color: #1f4f41;
  border: 1px solid #d1fae5;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
`;

export const CardDescription = styled.p`
  color: #4b5563;
  line-height: 1.6;
  font-size: 15px;
`;

export const InfoList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  li {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 12px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 13px;
    color: #4b5563;

    strong {
      font-size: 11px;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
  }
`;

export const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const ActionButton = styled.button`
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover:enabled {
    background: #f9fafb;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ActionLink = styled.a`
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  border-radius: 12px;
  padding: 12px 16px;
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease;

  &:hover {
    background: #f9fafb;
  }
`;

export const PrimaryButton = styled.button`
  border: none;
  background: #1f4f41;
  color: #ffffff;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.15s ease;
  flex: 1;

  &:hover {
    opacity: 0.92;
  }
`;

export const LoadingCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 56px 32px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;

  &::before {
    content: '';
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid #e5e7eb;
    border-top-color: #1f4f41;
    animation: ${spin} 0.8s linear infinite;
  }

  h2 {
    font-size: 18px;
    color: #111827;
  }

  p {
    color: #6b7280;
    font-size: 14px;
    max-width: 300px;
    line-height: 1.6;
  }
`;

export const EmptyState = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 56px 32px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 12px;

  &::before {
    content: '';
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #f3f4f6;
    border: 2px dashed #d1d5db;
  }

  h2 {
    font-size: 18px;
    color: #111827;
  }

  p {
    color: #6b7280;
    font-size: 14px;
    max-width: 300px;
    line-height: 1.6;
  }
`;
