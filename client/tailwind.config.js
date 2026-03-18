/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c7d8ff',
          300: '#a4bfff',
          400: '#7c9cff',
          500: '#4d6fff',
          600: '#2a4cff',
          700: '#1a3bdb',
          800: '#1530b0',
          900: '#122b8a',
        },
        surface: {
          50: '#f8f9fb',
          100: '#f0f2f7',
          200: '#e4e7ef',
          800: '#1a1d2e',
          900: '#0f1117',
          950: '#080a10',
        },
      },
    },
  },
  plugins: [],
};
