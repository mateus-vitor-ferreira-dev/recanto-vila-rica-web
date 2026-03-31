import styled from "styled-components";

export const Container = styled.footer`
  width: 100%;
  border-top: 1px solid #e5e7eb;
  background: #ffffff;
  margin-top: auto;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  color: #6b7280;
  font-size: 14px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;