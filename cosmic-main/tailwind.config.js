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
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'pulse-in': 'pulseIn 0.5s ease-out forwards',
        'border-pulse': 'borderPulse 2s infinite',
        'arrow': 'arrow 1.5s infinite',
        'color-change': 'colorChange 4s infinite alternate',
        'slideUp': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseIn: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '0.5' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        borderPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(159, 194, 47, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(159, 194, 47, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(159, 194, 47, 0)' },
        },
        arrow: {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(0)' },
        },
        colorChange: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(45deg)' },
        },
      },
      zIndex: {
        '60': '60',
        '70': '70',
      },
      fontSize: {
        '2xs': '0.625rem', // 10px
      },
    },
  },
  plugins: [],
}