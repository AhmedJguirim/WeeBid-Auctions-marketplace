/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Mulish"', "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ['"Source Serif 4"', "Georgia", "Times New Roman", "serif"],
      },
      colors: {
        brand: {
          50: "#f1f4ff",
          100: "#c2c8ff",
          200: "#a3b4ff",
          300: "#84a2ff",
          400: "#3d84ff",
          500: "#3369ff",
          600: "#2954ff",
          700: "#1f39ff",
          800: "#172bc4",
          900: "#14238f",
          950: "#0e1766",
        },
      },
      keyframes: {
        pulseDot: {
          "0%,100%": { opacity: 1 },
          "50%": { opacity: 0.35 },
        },
      },
      animation: {
        "pulse-dot": "pulseDot 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
