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
        dark: {
          bg: '#000000',
          base: '#181818',
          card: '#1F1F1F',
          surface: '#272727',
          border: '#313131',
          accentDark: '#131209',
        },
        // Restrained healthcare teal/emerald accent
        tealAccent: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        alertWarn: {
          bg: '#2A1F13',
          border: '#6B4312',
          text: '#F59E0B',
          badge: '#D97706',
        },
        alertCritical: {
          bg: '#281315',
          border: '#6E1B21',
          text: '#F87171',
          badge: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
      spacing: {
        '25': '2px',
        '50': '4px',
        '75': '8px',
        '100': '12px',
        '200': '16px',
        '300': '24px',
        '400': '32px',
        '500': '40px',
        '600': '48px',
        '700': '64px',
        '800': '80px',
        '900': '96px',
      },
      transitionTimingFunction: {
        'base-curve': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        '500': '500ms',
        '300': '300ms',
      }
    },
  },
  plugins: [],
}
