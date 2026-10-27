/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        border: 'var(--border)',
        accent: 'var(--accent)',
        'btn-bg': 'var(--btn-bg)',
        'btn-text': 'var(--btn-text)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        sans: ['var(--font-family)'],
      },
      boxShadow: {
        theme: '0 4px 20px -2px var(--shadow-color, rgba(0, 0, 0, 0.05))',
      },
      spacing: {
        sidebar: '220px',
        'sidebar-collapsed': '72px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      transitionDuration: {
        250: '250ms',
        350: '350ms',
      },
    },
  },
  plugins: [],
};
