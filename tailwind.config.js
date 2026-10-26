/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172431",
        muted: "#75848f",
        brand: "#005a9e",
        canvas: "#f5f7fa"
      }
    }
  },
  plugins: []
};
