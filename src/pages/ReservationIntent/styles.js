import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const Header = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
`;

export const Title = styled.h1`
  font-size: 34px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
`;

export const Description = styled.p`
  max-width: 700px;
  color: #6b7280;
  line-height: 1.6;
  font-size: 16px;
`;

export const PriceCard = styled.div`
  min-width: 240px;
  background: linear-gradient(135deg, #1f4f41 0%, #2f6b59 100%);
  color: #ffffff;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);

  span {
    font-size: 14px;
    opacity: 0.9;
  }

  strong {
    font-size: 26px;
    font-weight: 700;
  }

  small {
    font-size: 12px;
    opacity: 0.8;
  }
`;

export const ContentGrid = styled.section`
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const SectionCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
`;

export const SectionText = styled.p`
  color: #6b7280;
  line-height: 1.6;
  font-size: 14px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  span {
    font-size: 13px;
    color: #6b7280;
  }

  strong {
    font-size: 15px;
    color: #111827;
  }
`;

export const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const OptionBlock = styled.div`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 16px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const OptionTop = styled.div`
  display: flex;
  flex-direction: column;
`;

export const OptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

export const OptionInfo = styled.div`
  display: flex;
  flex-direction: column;

  strong {
    color: #111827;
    font-size: 15px;
  }

  span {
    font-size: 13px;
    color: #6b7280;
  }
`;

export const OptionAction = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

export const RangeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const RangeLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

export const RangeInput = styled.input`
  width: 100%;
  cursor: pointer;
`;

export const RangeScale = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #6b7280;
`;

export const SummaryList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    font-size: 14px;
    color: #374151;
  }

  li.total {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #e5e7eb;
    font-weight: 700;
    color: #111827;
  }
`;

export const ContractBox = styled.div`
  max-height: 420px;
  overflow-y: auto;
  padding: 16px;
  border-radius: 14px;
  background: #fafafa;
  border: 1px solid #e5e7eb;
  line-height: 1.6;
  font-size: 14px;
  color: #374151;

  p {
    margin-bottom: 12px;
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

export const RouteButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 12px 18px;
  border-radius: 12px;
  background: #1f4f41;
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.94;
  }
`;

export const ActionsCard = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const FieldLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

export const DateInput = styled.input`
  height: 44px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 0 12px;
  font-size: 14px;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #1f4f41;
  }
`;

export const TimeInput = styled(DateInput)``;

export const ContractHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`;

export const ToggleContractButton = styled.button`
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

export const PrimaryActionButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: #1f4f41;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.94;
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;