import styled from "styled-components";

export const GoogleBtn = styled.button`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;

  img {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;
