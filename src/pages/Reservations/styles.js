import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Header = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
`;

export const Description = styled.p`
  color: #6b7280;
  line-height: 1.6;
  font-size: 15px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const Card = styled.article`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  strong {
    display: block;
    font-size: 18px;
    color: #111827;
    margin-bottom: 4px;
  }

  span {
    font-size: 14px;
    color: #6b7280;
  }
`;

export const CardBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }

  div {
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  span {
    font-size: 12px;
    font-weight: 500;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  strong {
    font-size: 16px;
    font-weight: 700;
    color: #111827;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
`;

export const PayButton = styled.button`
  background: #1f4f41;
  color: #ffffff;
  border: none;
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.9;
  }
`;

export const CancelButton = styled.button`
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  height: 44px;
  padding: 0 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: #fee2e2;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Status = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 110px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid;

  ${({ status }) => {
    switch (status) {
      case "PAID":
        return `
          background: #ecfdf3;
          color: #166534;
          border-color: #bbf7d0;
        `;
      case "CANCELLED":
      case "EXPIRED":
        return `
          background: #f3f4f6;
          color: #6b7280;
          border-color: #e5e7eb;
        `;
      case "PENDING":
      default:
        return `
          background: #fffbeb;
          color: #b45309;
          border-color: #fde68a;
        `;
    }
  }}
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
