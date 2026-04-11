import styled from "styled-components";

export const Container = styled.div``;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
`;

export const PageDescription = styled.p`
  color: #6b7280;
  max-width: 600px;
  line-height: 1.6;
  font-size: 15px;
`;

export const EstimatedCard = styled.div`
  background: #ffffff;
  border: 1px solid #d1fae5;
  border-radius: 16px;
  padding: 20px 24px;
  min-width: 220px;
  box-shadow: 0 4px 16px rgba(31, 79, 65, 0.1);
  flex-shrink: 0;

  span {
    display: block;
    color: #6b7280;
    font-size: 13px;
    font-weight: 500;
  }

  strong {
    display: block;
    font-size: 26px;
    font-weight: 800;
    color: #1f4f41;
    margin: 6px 0 4px;
  }

  small {
    color: #9ca3af;
    font-size: 13px;
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;

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

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
`;

export const CardTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
`;

export const CardDescription = styled.p`
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 20px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;

export const InfoBox = styled.div`
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 14px;
  border-radius: 12px;

  span {
    display: block;
    color: #6b7280;
    font-size: 12px;
    font-weight: 500;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  strong {
    color: #111827;
    font-size: 14px;
    font-weight: 600;
  }
`;

export const RouteButton = styled.button`
  width: 100%;
  background: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f9fafb;
  }
`;

export const FormRow = styled.div`
  display: flex;
  gap: 16px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

export const RangeValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #1f4f41;
  margin-bottom: 12px;
`;

export const StyledRange = styled.input`
  width: 100%;
  appearance: none;
  height: 6px;
  border-radius: 4px;
  background: #e5e7eb;
  outline: none;
  margin-bottom: 8px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    background: #1f4f41;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 0 4px rgba(31, 79, 65, 0.15);
    transition: box-shadow 0.15s ease;
  }

  &::-webkit-slider-thumb:hover {
    box-shadow: 0 0 0 6px rgba(31, 79, 65, 0.2);
  }
`;

export const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  color: #9ca3af;
  font-size: 12px;
`;

export const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  padding: 14px 16px;
  border-radius: 12px;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:has(input:checked:not(:disabled)) {
    border-color: #6ee7b7;
    background: #f0fdf9;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  strong {
    color: #111827;
    font-size: 14px;
    font-weight: 600;
  }

  span {
    color: #6b7280;
    font-size: 13px;
  }

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #1f4f41;
    flex-shrink: 0;
  }
`;

export const SummaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  span {
    font-size: 14px;
    color: #6b7280;
  }

  strong {
    font-size: 14px;
    color: #111827;
    font-weight: 600;
    text-align: right;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 16px 0;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 15px;
    font-weight: 600;
    color: #374151;
  }

  strong {
    color: #1f4f41;
    font-size: 22px;
    font-weight: 800;
  }
`;

export const ActionCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(15, 23, 42, 0.05);
`;

export const ConfirmButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: #1f4f41;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.92;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ContractCard = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ContractTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #111827;
`;

export const ContractDescription = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: #6b7280;
`;

export const ContractLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 10px 14px;
  border-radius: 10px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    background: #e5e7eb;
  }
`;

export const ContractDownloadWrapper = styled.div`
  & > a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    padding: 10px 14px;
    border-radius: 10px;
    background: #f3f4f6;
    border: 1px solid #e5e7eb;
    color: #374151;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.15s ease;

    &:hover {
      background: #e5e7eb;
    }
  }
`;

export const ContractCheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;

  input {
    margin-top: 2px;
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #1f4f41;
    flex-shrink: 0;
  }

  label {
    font-size: 13px;
    line-height: 1.5;
    color: #374151;
    cursor: pointer;
  }
`;

export const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const PlanCard = styled.div`
  border: 2px solid ${({ $selected, $disabled }) =>
    $disabled ? "#e5e7eb" : $selected ? "#1f4f41" : "#e5e7eb"};
  border-radius: 16px;
  padding: 16px;
  cursor: ${({ $disabled }) => ($disabled ? "no-drop" : "pointer")};
  background: ${({ $selected, $disabled }) =>
    $disabled ? "#f3f4f6" : $selected ? "#f0fdf9" : "#ffffff"};
  opacity: ${({ $disabled }) => ($disabled ? "0.5" : "1")};
  transition: border-color 0.15s ease, background 0.15s ease, opacity 0.15s ease;

  &:hover {
    border-color: ${({ $disabled }) => ($disabled ? "#e5e7eb" : "#6ee7b7")};
    background: ${({ $disabled }) => ($disabled ? "#f3f4f6" : "#f9fefb")};
  }
`;

export const PlanLabel = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 4px;
`;

export const PlanDays = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 10px;
  line-height: 1.4;
`;

export const PlanPrice = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #1f4f41;
`;

export const QuoteLoading = styled.p`
  font-size: 13px;
  color: #9ca3af;
  text-align: center;
  padding: 8px 0;
`;

export const DiscountItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  span {
    font-size: 14px;
    color: #16a34a;
  }

  strong {
    font-size: 14px;
    color: #16a34a;
    font-weight: 600;
    text-align: right;
  }
`;

export const PlanWarning = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 12px 14px;
  margin-top: 12px;
  font-size: 13px;
  color: #92400e;
  line-height: 1.5;

  &::before {
    content: "⚠";
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 1px;
  }
`;

export const KidsInput = styled.input`
  width: 72px;
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  text-align: center;
  outline: none;

  &:focus {
    border-color: #1f4f41;
    box-shadow: 0 0 0 3px rgba(31, 79, 65, 0.1);
  }
`;

export const NotesField = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #374151;
  resize: vertical;
  outline: none;
  font-family: inherit;
  line-height: 1.5;
  box-sizing: border-box;

  &:focus {
    border-color: #1f4f41;
    box-shadow: 0 0 0 3px rgba(31, 79, 65, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;
