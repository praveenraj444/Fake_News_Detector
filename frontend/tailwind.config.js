/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0A0D12",
          panel: "#12161C",
          elevated: "#1A1F27",
        },
        border: {
          DEFAULT: "#242B34",
          strong: "#333C48",
        },
        ink: {
          DEFAULT: "#EDEAE3",
          muted: "#9CA3AF",
          faint: "#6B7280",
        },
        accent: {
          DEFAULT: "#C9A24B",
          light: "#DCB65E",
          bg: "#231C0E",
        },
        real: {
          DEFAULT: "#4C9A6A",
          light: "#6BB985",
          bg: "#101F17",
        },
        fake: {
          DEFAULT: "#C1493D",
          light: "#D66A5F",
          bg: "#221310",
        },
      },
      fontFamily: {
        sans: ["Inter", "Noto Sans Tamil", "system-ui", "sans-serif"],
        serif: ["Source Serif 4", "Georgia", "serif"],
        tamil: ["Noto Sans Tamil", "sans-serif"],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        pulseSoft: "pulseSoft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
