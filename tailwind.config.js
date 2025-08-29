/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lavender': {
          50: '#f8f7ff',
          100: '#f1efff',
        }
      }
    },
  },
  plugins: [],
}