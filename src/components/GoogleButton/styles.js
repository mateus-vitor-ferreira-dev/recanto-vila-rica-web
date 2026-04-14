import styled from "styled-components";

export const GoogleBtnWrapper = styled.div`
  width: 100%;
  max-width: 100%;
  display: flex;

  /* div criada pela lib */
  & > div {
    width: 100% !important;
    max-width: 100% !important;
  }

  /* iframe/botão interno do Google */
  & iframe {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 100% !important;
  }
`;