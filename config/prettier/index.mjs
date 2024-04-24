/** @typedef {import('prettier').Config} PrettierConfig */

/** @type { PrettierConfig } */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  arrowParens: "avoid",
  endOfLine: "auto",
  printWidth: 80,
  semi: false,
  singleAttributePerLine: true,
  singleQuote: false,
  tabWidth: 2,
  useTabs: false,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  trailingComma: "es5",
  bracketSpacing: true,
  bracketSameLine: false,
}

export default config