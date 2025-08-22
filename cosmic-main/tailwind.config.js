/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        'primary': {
          '50': '#e6f0f5',
          '100': '#cce1eb',
          '200': '#99c3d7',
          '300': '#66a5c3',
          '400': '#3387af',
          '500': '#00699b',
          '600': '#003e63', /* Main primary color */
          '700': '#003252',
          '800': '#002742',
          '900': '#001b31',
          '950': '#000e19',
        },
        'accent': {
          '50': '#f4f9e6',
          '100': '#e9f3cd',
          '200': '#d3e79b',
          '300': '#bddb69',
          '400': '#a7cf37',
          '500': '#9fc22f', /* Main accent color */
          '600': '#7f9b26',
          '700': '#5f741c',
          '800': '#404d13',
          '900': '#202709',
          '950': '#101305',
        },
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      zIndex: {
        '60': '60',
        '70': '70',
      },
    },
  },
  plugins: [],
}