/** @type {import('tailwindcss').Config} */
import withMT from '@material-tailwind/react/utils/withMT';

export default withMT({
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      tablet: '640px',
      // => @media (min-width: 640px) { ... }

      laptop: { max: '1500px' },
      // => @media (min-width: 1024px) { ... }

      desktop: '1500px',
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      aspectRatio: {
        verticalMobile: '9/16',
      },

      colors: {
        primary: '#C1C1C1',
        secondary: '#753742',
        tertiary: '#139A43',
        background: '#2C4251',
        myWhite: '#FDECF2',

        TK: {
          background: '#131921',
          default: '#131921',
        },
      },
    },
  },
  plugins: [],
});
