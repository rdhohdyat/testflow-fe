const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    container: {
      center: true
    },
    extend: {
      colors: {
        // Use emerald as the primary brand color
        primary: colors.emerald,
        // Soften pure black for a more modern, premium dark mode
        black: "#09090b", // zinc-950
        // Use emerald for blue references if applicable, otherwise keep indigo for variety if needed
        blue: colors.emerald,
        // Use zinc for a clean, neutral gray scale
        neutral: colors.zinc,
        // Also map gray to zinc for consistency
        gray: colors.zinc,
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}
