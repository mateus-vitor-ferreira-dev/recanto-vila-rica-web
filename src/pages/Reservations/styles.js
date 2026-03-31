import styled from "styled-components";

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
        return `
          background: #fef2f2;
          color: #b91c1c;
          border-color: #fecaca;
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

export const CardBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }

  div {
    background: #fafafa;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  span {
    font-size: 13px;
    color: #6b7280;
  }

  strong {
    font-size: 15px;
    color: #111827;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const CancelButton = styled.button`
  border: none;
  background: #b91c1c;
  color: #ffffff;
  height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.92;
  }
`;

export const LoadingCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);

  h2 {
    margin-bottom: 8px;
    color: #111827;
  }

  p {
    color: #6b7280;
  }
`;

export const EmptyState = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);

  h2 {
    margin-bottom: 8px;
    color: #111827;
  }

  p {
    color: #6b7280;
    line-height: 1.6;
  }
`;