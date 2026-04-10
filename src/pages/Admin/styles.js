import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const PageHeader = styled.section`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
`;

export const Description = styled.p`
  color: #6b7280;
  font-size: 15px;
  line-height: 1.6;
`;

/* Tabs */
export const TabBar = styled.div`
  display: flex;
  gap: 4px;
  background: #f3f4f6;
  border-radius: 14px;
  padding: 4px;
  width: fit-content;

  @media (max-width: 600px) {
    width: 100%;
    flex-wrap: wrap;
  }
`;

export const Tab = styled.button`
  height: 40px;
  padding: 0 20px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  background: ${({ $active }) => ($active ? "#1f4f41" : "transparent")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#6b7280")};

  &:hover:not([disabled]) {
    color: ${({ $active }) => ($active ? "#ffffff" : "#111827")};
  }

  @media (max-width: 600px) {
    flex: 1;
  }
`;

/* Summary cards */
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
`;

export const SummaryCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SummaryLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const SummaryValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${({ $accent }) => ($accent ? "#1f4f41" : "#111827")};
`;

export const SummarySubtitle = styled.span`
  font-size: 13px;
  color: #6b7280;
`;

/* Generic section */
export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
`;

/* Filters row */
export const FiltersRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const Select = styled.select`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  outline: none;

  &:focus {
    border-color: #1f4f41;
  }
`;

export const DateInput = styled.input`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 14px;
  color: #374151;
  outline: none;

  &:focus {
    border-color: #1f4f41;
  }
`;

/* Table */
export const TableWrapper = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
`;

export const Th = styled.th`
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 14px 18px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 14px 18px;
  font-size: 14px;
  color: #374151;
  border-bottom: 1px solid #f3f4f6;
  white-space: nowrap;

  &:last-child {
    color: #111827;
  }
`;

export const Tr = styled.tr`
  &:last-child ${Td} {
    border-bottom: none;
  }

  &:hover ${Td} {
    background: #f9fafb;
  }
`;

/* Status badge */
export const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid;
  white-space: nowrap;

  ${({ $status }) => {
    switch ($status) {
      case "PAID":
        return `background: #ecfdf3; color: #166534; border-color: #bbf7d0;`;
      case "CANCELLED":
      case "EXPIRED":
        return `background: #f3f4f6; color: #6b7280; border-color: #e5e7eb;`;
      case "PENDING":
      default:
        return `background: #fffbeb; color: #b45309; border-color: #fde68a;`;
    }
  }}
`;

/* Pagination */
export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 4px;
`;

export const PageInfo = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

export const PageButton = styled.button`
  height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    border-color: #1f4f41;
    color: #1f4f41;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/* Cards list (campaigns) */
export const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const CampaignCard = styled.div`
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

export const CampaignInfo = styled.div`
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

export const CampaignActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
`;

export const ActiveBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid;

  ${({ $active }) =>
    $active
      ? `background: #ecfdf3; color: #166534; border-color: #bbf7d0;`
      : `background: #f3f4f6; color: #6b7280; border-color: #e5e7eb;`}
`;

export const CampaignStatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid;
  white-space: nowrap;

  ${({ $status }) => {
    switch ($status) {
      case "active":
        return `background: #ecfdf3; color: #166534; border-color: #bbf7d0;`;
      case "scheduled":
        return `background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe;`;
      case "ended":
        return `background: #f3f4f6; color: #6b7280; border-color: #e5e7eb;`;
      case "disabled":
      default:
        return `background: #fef2f2; color: #b91c1c; border-color: #fecaca;`;
    }
  }}
`;

export const WinnerCard = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  strong {
    font-size: 18px;
    color: #111827;
  }

  span {
    font-size: 14px;
    color: #374151;
  }
`;

export const MessagePreview = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  color: #374151;
  white-space: pre-wrap;
  line-height: 1.6;
`;

export const CopyButton = styled.button`
  align-self: flex-end;
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: #1f4f41;
    color: #1f4f41;
  }
`;

export const RaffleButton = styled.button`
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  border: 1px solid #1f4f41;
  background: #ffffff;
  color: #1f4f41;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #1f4f41;
    color: #ffffff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* Buttons */
export const PrimaryButton = styled.button`
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  border: none;
  background: #1f4f41;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    opacity: 0.88;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SecondaryButton = styled.button`
  height: 40px;
  padding: 0 18px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    border-color: #1f4f41;
    color: #1f4f41;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DangerButton = styled.button`
  height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #fee2e2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* Modal */
export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const ModalBox = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }
`;

export const TextInput = styled.input`
  height: 42px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  color: #111827;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: #1f4f41;
  }
`;

export const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
`;

/* Empty / Loading states */
export const EmptyState = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 48px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  h3 {
    font-size: 16px;
    color: #374151;
    font-weight: 600;
  }

  p {
    font-size: 14px;
    color: #9ca3af;
  }
`;

export const LoadingSpinner = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  border-top-color: #1f4f41;
  animation: ${spin} 0.8s linear infinite;
  margin: 40px auto;
`;

/* Tab panel — always mounted, hidden when inactive */
export const TabPanel = styled.div`
  display: ${({ $active }) => ($active ? "contents" : "none")};
`;

/* Holiday row */
export const HolidayCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const HolidayInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-size: 14px;
    color: #111827;
  }

  span {
    font-size: 13px;
    color: #6b7280;
  }
`;

export const HolidayType = styled.span`
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
`;
