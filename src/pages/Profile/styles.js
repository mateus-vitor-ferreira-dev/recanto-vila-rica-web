import styled, { keyframes } from "styled-components";

const spinAnim = keyframes`
  to { transform: rotate(360deg); }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  animation: ${fadeUp} 0.3s ease;
`;

export const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 320px;

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
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageTitle = styled.h1`
  font-size: 30px;
  font-weight: 700;
  color: #111827;
`;

export const PageSubtitle = styled.p`
  font-size: 15px;
  color: #6b7280;
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`;

/* ─── Identity sidebar ─── */

export const IdentityCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
`;

export const AvatarLarge = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #1f4f41;
  color: #ffffff;
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.03em;
  margin-bottom: 4px;
`;

export const IdentityName = styled.strong`
  font-size: 16px;
  font-weight: 700;
  color: #111827;
`;

export const IdentityEmail = styled.span`
  font-size: 13px;
  color: #6b7280;
  word-break: break-all;
`;

export const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  background: #ecfdf3;
  color: #1f4f41;
  border: 1px solid #d1fae5;
  margin-top: 4px;
`;

/* ─── Edit form ─── */

export const FormCard = styled.form`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.04);
`;

export const SectionTitle = styled.h2`
  font-size: 17px;
  font-weight: 700;
  color: #111827;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const FormFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid #f3f4f6;
`;

export const CancelButton = styled.button`
  padding: 10px 20px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f9fafb;
  }
`;

export const SaveButton = styled.button`
  padding: 10px 24px;
  border: none;
  border-radius: 10px;
  background: #1f4f41;
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover:not(:disabled) {
    opacity: 0.92;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
