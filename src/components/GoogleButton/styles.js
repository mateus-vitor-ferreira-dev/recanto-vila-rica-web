import styled from "styled-components";

export const GoogleBtnWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  /* força o iframe do Google a ocupar a largura disponível */
  & > div,
  & iframe {
    width: 100% !important;
  }
`;
