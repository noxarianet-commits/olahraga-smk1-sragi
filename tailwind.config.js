/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#2bee6c",
        "background-light": "#f6f8f6",
        "background-dark": "#102216",
        // Keep existing colors for other components if needed, or overwrite
        primary: { // Overwriting previous object structure to match single string if simple usage, but let's keep object for full palette if helpful. 
          // Actually, user design treats primary as single color #2bee6c.
          // But we have components using primary-50, primary-600.
          // Let's make 'primary' a custom color and map palette to it or keep old palette?
          // User requested SPECIFIC colors. I will prioritize their config.
          DEFAULT: "#2bee6c",
          50: '#f0fdf4', // generated light variants for 2bee6c
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          // We'll map the specific user color to DEFAULT
        },
        // Custom user colors
        "brand": "#2bee6c",
        "bg-light": "#f6f8f6",
        "bg-dark": "#102216",
      },
      fontFamily: {
        "sans": ["Lexend", "sans-serif"],
        "display": ["Lexend", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
      },
    },
  },
  plugins: [],
}
