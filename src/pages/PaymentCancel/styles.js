import styled, { keyframes } from "styled-components";

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  0%   { transform: scale(0.6); opacity: 0; }
  70%  { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 32px 0;
`;

export const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 28px;
  padding: 56px 48px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 8px 32px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  animation: ${fadeUp} 0.4s ease;

  @media (max-width: 600px) {
    padding: 40px 24px;
  }
`;

export const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${popIn} 0.5s ease 0.1s both;
`;

export const XIcon = styled.div`
  width: 32px;
  height: 32px;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 28px;
    height: 3px;
    background: #6b7280;
    border-radius: 2px;
    top: 50%;
    left: 50%;
  }

  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }

  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
`;

export const Title = styled.h1`
  font-size: 26px;
  font-weight: 700;
  color: #111827;
`;

export const Description = styled.p`
  font-size: 15px;
  color: #6b7280;
  line-height: 1.7;
  max-width: 380px;
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 8px;
`;

export const PrimaryButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: #1f4f41;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.92;
  }
`;

export const SecondaryButton = styled.button`
  width: 100%;
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #ffffff;
  color: #374151;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #f9fafb;
  }
`;
