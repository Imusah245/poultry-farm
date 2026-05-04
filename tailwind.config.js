/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        farm: {
          green:  '#2D6A4F',
          'green-light': '#40916C',
          'green-pale': '#D8F3DC',
          yellow: '#F4A620',
          'yellow-light': '#FFD166',
          'yellow-pale': '#FFF3CD',
          earth:  '#6B4C2A',
          cream:  '#FAFAF5',
          dark:   '#1A2E1A',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.5s ease forwards',
        'count-up':   'countUp 0.4s ease',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      boxShadow: {
        card:  '0 4px 24px rgba(45,106,79,0.10)',
        hover: '0 8px 40px rgba(45,106,79,0.18)',
        warm:  '0 4px 24px rgba(244,166,32,0.15)',
      },
    },
  },
  plugins: [],
}
