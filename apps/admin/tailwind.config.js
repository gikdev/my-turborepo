import tailwindcssRadixColors from "tailwindcss-radix-colors"

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/shared/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      main: ["Vazirmatn", "sans-serif"],
    },
  },
  plugins: [tailwindcssRadixColors],
}
