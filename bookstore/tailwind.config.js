/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': "#00001B",
        "primaryBG": "#001529",
        'gold':"#c39a1c",
      },
      fontFamily: {
        'primary': ['Mountains of Christmas', 'serif'],
      },
      fontSize: {
        'xxl': '3rem', // Customize font size as you want
      },
    },
  },
  plugins: [],
}
