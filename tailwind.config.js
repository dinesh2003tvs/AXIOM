/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "system-ui", "sans-serif"],
        display: ['"Plus Jakarta Sans"', "sans-serif"]
      },
      colors: {
        ink: "#0f172a",
        muted: "#64748b",
        brand: "#2563eb",
        canvas: "#f3f6fb",
        sidebar: {
          bg: "#0a1122",
          surface: "#101b33",
          hover: "#15223e",
          active: "#1d4ed8"
        }
      }
    }
  },
  plugins: []
};
