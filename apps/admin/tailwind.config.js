import tailwindcssRadixColors from "tailwindcss-radix-colors"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/emex-shared/src/**/*.{js,jsx}",
  ],
  theme: {
    fontFamily: {
      main: ["Vazirmatn", "sans-serif"],
    },
  },
  plugins: [tailwindcssRadixColors],
}
