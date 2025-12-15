/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brutal: {
          bg: '#FFFEF2',
          dark: '#0A0A0A',
          border: '#000000',
          primary: '#FF6B35',
          secondary: '#00D9FF',
          success: '#00F5A0',
          warning: '#FFC700',
          danger: '#FF006E',
          purple: '#A855F7',
          cyan: '#06B6D4',
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #000000',
        'brutal-lg': '8px 8px 0px 0px #000000',
        'brutal-sm': '2px 2px 0px 0px #000000',
        'brutal-light': '4px 4px 0px 0px #FFFEF2',
        'brutal-light-lg': '8px 8px 0px 0px #FFFEF2',
        'brutal-light-sm': '2px 2px 0px 0px #FFFEF2',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
        'sans': ['Arial', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
