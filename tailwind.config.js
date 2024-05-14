/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', ],
  theme: {
    extend: {
      colors: {
        primary:'#C1C1C1',
        secondary:'#753742',
        tertiary:'#139A43',
        background:'#2C4251',
        myWhite:'#FDECF2',

        TK: {
          background: '#131921',
          default: '#131921',
        },
      },
    },
  },
  plugins: [],
});
