import { GlobalStyle } from "../src/styles/global";

/** @type { import('@storybook/react-vite').Preview } */
const preview = {
  decorators: [
    (Story, context) => {
      const theme = context.globals?.theme ?? "light";
      document.documentElement.setAttribute("data-theme", theme);
      return (
        <>
          <GlobalStyle />
          <div style={{ padding: "24px", background: "var(--bg-page)", minHeight: "100vh" }}>
            <Story />
          </div>
        </>
      );
    },
  ],

  globalTypes: {
    theme: {
      name: "Tema",
      description: "Tema claro ou escuro",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "Claro", icon: "sun" },
          { value: "dark",  title: "Escuro", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: "todo" },
    layout: "fullscreen",
  },
};

export default preview;
