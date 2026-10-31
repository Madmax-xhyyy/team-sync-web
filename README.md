# TeamSync

## Customizing the theme

Edit **`src/styles/theme.css`** to customize the app's appearance. The `:root`
block defines light colors; `:root.dark` defines dark colors. The same file owns
the font, border radius, chart colors, status colors, and workspace preview shadow.

Components use semantic Tailwind utilities such as `bg-background`, `bg-card`,
`text-foreground`, `text-muted-foreground`, and `border-border`. Use these tokens
for new UI instead of hardcoded colors or separate light/dark color classes.
Change both a background token and its matching foreground token together, and
check text contrast in both themes.

The appearance menu offers **Light**, **Dark**, and **System**. System is the
default and follows live OS changes. Explicit preferences persist under the
`teamsync-theme` localStorage key and synchronize across tabs. Choosing System
removes that override. Themes still work for the current tab when storage is
blocked. The preference belongs to the browser, so it survives logout.

An early script in `index.html` applies the theme before rendering to prevent a
wrong-theme flash. Keep its storage key and media query aligned with
`src/lib/theme.ts`. Browser controls use the matching `color-scheme`, and the
browser's theme color is read from the CSS background token.

Run theme behavior checks with `npm run test:theme` (Node 22.18+).

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
