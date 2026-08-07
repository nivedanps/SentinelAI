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
        hazard: {
          red: '#EF4444',
          orange: '#F97316',
          yellow: '#EAB308',
          green: '#22C55E',
          blue: '#3B82F6',
          dark: '#0F172A',
          card: '#1E293B',
        }
      }
    },
  },
  plugins: [],
}
