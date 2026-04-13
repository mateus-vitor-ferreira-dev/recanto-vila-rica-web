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
  min-height: 64px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
`;

export const BrandWrapper = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  white-space: nowrap;
`;

export const Logo = styled.img`
  width: 52px;
  height: 52px;
  object-fit: contain;
`;

export const BrandText = styled.span`
  font-size: 17px;
  font-weight: 700;
  color: #1f4f41;

  @media (max-width: 600px) {
    display: none;
  }
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const NavLink = styled(Link)`
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "#1f4f41" : "#4b5563")};
  background: ${({ $active }) => ($active ? "#ecfdf3" : "transparent")};
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProfileLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  border-radius: 10px;
  padding: 4px 8px 4px 4px;
  transition: background 0.15s ease;

  &:hover {
    background: #f3f4f6;
  }

  @media (max-width: 480px) {
    padding: 4px;
  }
`;

export const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #1f4f41;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  letter-spacing: 0.03em;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  span {
    font-size: 11px;
    color: #9ca3af;
  }

  strong {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const LogoutButton = styled.button`
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #374151;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: #f3f4f6;
  }
`;
