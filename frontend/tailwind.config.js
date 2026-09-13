/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Lora', 'serif'],
        sans: ['system-ui', 'sans-serif'],
      },
      colors: {
        clay: {
          500: '#d97757',
          600: '#c84b31',
          700: '#c2410c',
          800: '#9a3412',
        }
      }
    },
  },
  plugins: [],
}
