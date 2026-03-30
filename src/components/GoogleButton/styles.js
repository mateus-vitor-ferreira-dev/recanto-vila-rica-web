import styled from "styled-components";

export const GoogleBtn = styled.button`
  width: 100%;
  height: 45px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;

  font-size: 14px;
  font-weight: 500;
  color: #333;

  cursor: pointer;
  transition: 0.2s;

  img {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: #f5f5f5;
  }
`;