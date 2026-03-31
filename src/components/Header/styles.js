import { Link } from "react-router-dom";
import styled from "styled-components";

export const Container = styled.header`
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 72px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

export const BrandWrapper = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  white-space: nowrap;
`;

export const Logo = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  border-radius: 50%;
`;

export const BrandText = styled.span`
  font-size: 22px;
  font-weight: 700;
  color: #1f4f41;
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled(Link)`
  padding: 10px 14px;
  border-radius: 10px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "#1f4f41" : "#4b5563")};
  background: ${({ $active }) => ($active ? "#ecfdf3" : "transparent")};

  &:hover {
    background: #f3f4f6;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  span {
    font-size: 12px;
    color: #6b7280;
  }

  strong {
    font-size: 14px;
    color: #111827;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LogoutButton = styled.button`
  border: none;
  background: #1f4f41;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    opacity: 0.92;
  }
`;