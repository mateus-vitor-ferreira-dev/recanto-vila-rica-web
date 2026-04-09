import styled, { keyframes } from "styled-components";

const spinAnim = keyframes`
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  animation: ${fadeIn} 0.3s ease;
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 280px;
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

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
`;

export const PageDescription = styled.p`
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 24px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

/* ─── Reservation Summary Card ─── */

export const SummaryCard = styled.article`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const SummaryHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const VenueName = styled.h2`
  font-size: 26px;
  font-weight: 700;
  color: #111827;
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid;
  white-space: nowrap;

  ${({ status }) => {
    switch (status) {
      case "PAID":
        return `background: #ecfdf3; color: #166534; border-color: #bbf7d0;`;
      case "CANCELLED":
        return `background: #fef2f2; color: #b91c1c; border-color: #fecaca;`;
      case "PENDING":
      default:
        return `background: #fffbeb; color: #b45309; border-color: #fde68a;`;
    }
  }}
`;

export const Divider = styled.div`
  height: 1px;
  background: #f3f4f6;
`;

export const DetailList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailItem = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const DetailLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const DetailValue = styled.strong`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`;

export const TotalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const TotalLabel = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #374151;
`;

export const TotalValue = styled.strong`
  font-size: 30px;
  font-weight: 800;
  color: #1f4f41;
`;

/* ─── Payment Card ─── */

export const PaymentCard = styled.article`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 96px;
`;

export const PaymentTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
`;

export const PaymentDescription = styled.p`
  font-size: 14px;
  color: #6b7280;
  line-height: 1.6;
  margin-top: -8px;
`;

export const SecurityBadges = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
`;

export const SecurityItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #4b5563;
  font-weight: 500;
`;

export const SecurityDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1f4f41;
  flex-shrink: 0;
`;

export const AmountSummary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f0fdf9;
  border: 1px solid #d1fae5;
  border-radius: 14px;

  span {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
  }

  strong {
    font-size: 22px;
    font-weight: 800;
    color: #1f4f41;
  }
`;

export const PayButton = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 14px;
  background: #1f4f41;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s ease, transform 0.1s ease;

  &:hover:not(:disabled) {
    opacity: 0.92;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const InfoBox = styled.div`
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  color: #92400e;
  line-height: 1.5;
`;

export const CancelLink = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  text-decoration: underline;
  text-underline-offset: 3px;
  padding: 0;

  &:hover {
    color: #374151;
  }
`;

export const StripeBadge = styled.p`
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  border-top: 1px solid #f3f4f6;
  padding-top: 16px;
  margin-top: -4px;

  strong {
    color: #6b7280;
  }
`;
