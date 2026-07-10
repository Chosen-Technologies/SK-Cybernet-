/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            deep: "#0F172A",     // Slate 900 / Rich Navy
            accent: "#2563EB",   // Blue 600
            light: "#3B82F6",    // Blue 500
          },
          white: "#FFFFFF",
          gray: {
            light: "#F8FAFC",    // Slate 50
            border: "#F1F5F9",   // Slate 100
          }
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-outfit)", "sans-serif"],
      }
    }
  },
  plugins: []
};
