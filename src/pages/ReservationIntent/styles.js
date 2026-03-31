import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #0f0f0f;
  padding: 40px 20px;
`;

export const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  color: #fff;
  margin-bottom: 8px;
`;

export const PageDescription = styled.p`
  color: #aaa;
  max-width: 600px;
  line-height: 1.5;
`;

export const EstimatedCard = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  min-width: 220px;

  span {
    color: #aaa;
    font-size: 14px;
  }

  strong {
    display: block;
    font-size: 22px;
    color: #fff;
    margin: 8px 0;
  }

  small {
    color: #888;
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
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
`;

export const CardTitle = styled.h2`
  color: #fff;
  font-size: 18px;
  margin-bottom: 6px;
`;

export const CardDescription = styled.p`
  color: #aaa;
  font-size: 14px;
  margin-bottom: 16px;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

export const InfoBox = styled.div`
  background: #121212;
  padding: 12px;
  border-radius: 8px;

  span {
    display: block;
    color: #888;
    font-size: 12px;
  }

  strong {
    color: #fff;
    font-size: 14px;
  }
`;

export const RouteButton = styled.button`
  width: 100%;
  background: #6c5ce7;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #5a4bd6;
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
  color: #fff;
  font-size: 18px;
  margin-bottom: 8px;
`;

export const StyledRange = styled.input`
  width: 100%;
  appearance: none;
  height: 6px;
  border-radius: 4px;
  background: #333;
  outline: none;
  margin-bottom: 8px;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #6c5ce7;
    border-radius: 50%;
    cursor: pointer;
  }
`;

export const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  color: #888;
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
  background: #121212;
  padding: 12px;
  border-radius: 8px;

  strong {
    color: #fff;
    display: block;
  }

  span {
    color: #aaa;
    font-size: 13px;
  }

  input {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

export const SummaryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  color: #ddd;

  span {
    color: #aaa;
  }

  strong {
    color: #fff;
  }
`;

export const Divider = styled.div`
  height: 1px;
  background: #333;
  margin: 16px 0;
`;

export const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;

  span {
    color: #aaa;
  }

  strong {
    color: #fff;
    font-size: 18px;
  }
`;

export const ActionCard = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 20px;
`;

export const ConfirmButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  border: none;
  background: #00b894;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #019875;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ContractCard = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const ContractTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

export const ContractDescription = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: #6b7280;
`;

export const ContractLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 10px 14px;
  border-radius: 8px;
  background: #f3f4f6;
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: 0.2s;

  &:hover {
    background: #e5e7eb;
  }
`;

export const ContractCheckboxWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;

  input {
    margin-top: 3px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  label {
    font-size: 14px;
    line-height: 1.5;
    color: #374151;
    cursor: pointer;
  }
`;