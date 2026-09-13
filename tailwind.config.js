/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // dark: classes now respond to a .dark class (see ThemeContext),
                      // not the OS/browser color-scheme setting.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}