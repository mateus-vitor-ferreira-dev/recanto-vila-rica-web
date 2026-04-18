import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 640px;
`;

export const Header = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
`;

export const Description = styled.p`
  color: var(--text-muted);
  line-height: 1.6;
  font-size: 15px;
`;

export const Card = styled.div`
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const CardTitle = styled.h2`
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

export const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border-radius: 14px;
  border: 1px solid var(--border-default);
  background: var(--bg-page);
  text-decoration: none;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  text-align: left;
  width: 100%;

  &:hover {
    border-color: var(--brand);
    background: var(--bg-surface);
  }
`;

export const ContactIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${({ $bg }) => $bg || "var(--brand)"};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 22px;
    height: 22px;
    fill: #ffffff;
  }
`;

export const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

export const ContactLabel = styled.span`
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
`;

export const ContactValue = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
`;

export const ContactArrow = styled.span`
  font-size: 18px;
  color: var(--text-muted);
  flex-shrink: 0;
`;
