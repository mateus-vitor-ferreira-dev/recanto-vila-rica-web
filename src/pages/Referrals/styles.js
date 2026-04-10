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

export const InviteCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InviteTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

export const InviteRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const EmailInput = styled.input`
  flex: 1;
  min-width: 200px;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 14px;
  color: #111827;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #1f4f41;
  }

  &::placeholder {
    color: #9ca3af;
  }

  &:disabled {
    background: #f9fafb;
    cursor: not-allowed;
  }
`;

export const InviteButton = styled.button`
  height: 44px;
  padding: 0 22px;
  background: #1f4f41;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.15s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const NoCampaignBanner = styled.div`
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: 14px;
  color: #92400e;
  line-height: 1.5;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const ListTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
`;

export const ReferralCard = styled.article`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px 22px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const ReferralInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 15px;
    color: #111827;
  }

  span {
    font-size: 13px;
    color: #6b7280;
  }
`;

export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid;
  white-space: nowrap;

  ${({ $status }) => {
    switch ($status) {
      case "REWARDED":
        return `background: #ecfdf3; color: #166534; border-color: #bbf7d0;`;
      case "QUALIFIED":
        return `background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe;`;
      case "EXPIRED":
      case "CANCELLED":
        return `background: #f3f4f6; color: #6b7280; border-color: #e5e7eb;`;
      case "PENDING":
      default:
        return `background: #fffbeb; color: #b45309; border-color: #fde68a;`;
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
  background: #f9fafb;
  border: 1px dashed #d1d5db;
  border-radius: 16px;
  padding: 40px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;

  p {
    color: #6b7280;
    font-size: 14px;
    line-height: 1.6;
  }
`;
