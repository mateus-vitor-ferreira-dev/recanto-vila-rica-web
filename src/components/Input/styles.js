import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
`;

export const Field = styled.input`
  height: 48px;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  padding: 0 14px;
  outline: none;

  &:focus {
    border-color: #2f6f57;
  }
`;