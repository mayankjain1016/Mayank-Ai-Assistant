/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        apple: {
          bg: '#FFFFFF',
          surface: '#F5F5F7',
          border: '#E5E5EA',
          text: '#1D1D1F',
          meta: '#86868B',
          blue: '#0066CC',
          dark: '#000000',
        }
      },
      boxShadow: {
        'apple': '0 4px 24px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
