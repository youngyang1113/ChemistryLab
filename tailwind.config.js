/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          900: "#09090b",
          800: "#18181b",
          700: "#27272a",
          600: "#3f3f46",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      animation: {
        "bubble-rise": "bubbleRise 2.5s ease-in infinite",
        "precipitate-fall": "precipitateFall 3s ease-in forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        shake: "shake 0.4s cubic-bezier(.36,.07,.19,.97) both",
      },
      keyframes: {
        bubbleRise: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.8" },
          "100%": { transform: "translateY(-200px) scale(0.3)", opacity: "0" },
        },
        precipitateFall: {
          "0%": { transform: "translateY(0)", opacity: "0.9" },
          "100%": { transform: "translateY(180px)", opacity: "0.6" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(79, 172, 254, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(79, 172, 254, 0.5)" },
        },
        shake: {
          "10%, 90%": { transform: "translate3d(-1px, 0, 0)" },
          "20%, 80%": { transform: "translate3d(2px, 0, 0)" },
          "30%, 50%, 70%": { transform: "translate3d(-3px, 0, 0)" },
          "40%, 60%": { transform: "translate3d(3px, 0, 0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
