import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Inter, sans-serif;
    background: #f9fafb;
    color: #111827;
  }

  button, input {
    font-family: inherit;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;