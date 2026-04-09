import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }

  span {
    font-size: 12px;
    font-weight: 500;
    color: #9ca3af;
    white-space: nowrap;
  }
`;

export const FooterText = styled.p`
  text-align: center;
  color: #6b7280;
  font-size: 13px;
  margin-top: 4px;

  a {
    color: #1f4f41;
    font-weight: 600;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;
