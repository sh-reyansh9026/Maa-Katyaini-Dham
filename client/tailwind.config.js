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
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-alt': 'var(--surface-alt)',
        primary: 'var(--primary)',
        'primary-hover': 'var(--primary-hover)',
        'primary-fg': 'var(--primary-fg)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
        neutral: 'var(--neutral)',
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        DEFAULT: '0 2px 8px rgba(44, 36, 22, 0.1)',
        lg: '0 4px 16px rgba(44, 36, 22, 0.15)',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        hindi: ['Noto Serif Devanagari', 'serif'],
        display: ['Fraunces', 'serif'],
      },
    },
  },
  plugins: [],
}
