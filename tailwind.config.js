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
        themeBgMain: 'var(--theme-bg-main)',
        themeBgSecondary: 'var(--theme-bg-secondary)',
        themeTextPrimary: 'var(--theme-text-primary)',
        themeTextMuted: 'var(--theme-text-muted)',
        themeCardBg: 'var(--theme-card-bg)',
        accent: '#d94b38',
        maatiGreen: '#1a3626',
        maatiOrange: '#d85c27',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'pill': '999px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '36px',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0,0,0,0.08)',
        'floating': '0 18px 60px rgba(0,0,0,0.18)',
      }
    },
  },
  plugins: [],
}
