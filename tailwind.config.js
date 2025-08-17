/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'glass',
    'text-gradient',
    'hero-gradient',
    'animate-float',
    'animate-pulse-glow',
    'backdrop-blur-sm',
    'backdrop-blur-md',
    'backdrop-blur-lg',
    'backdrop-blur-xl',
    'text-shadow',
    'font-display',
    'font-mono',
    'bg-gradient-to-r',
    'bg-gradient-to-br',
    'bg-gradient-to-tr',
    'from-purple-400',
    'via-pink-500',
    'to-red-500',
    'min-h-screen',
    'overflow-hidden',
    'relative',
    'absolute',
    'fixed',
    'z-40',
    'z-50',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        'sports-gold': "var(--sports-gold)",
        'sports-red': "var(--sports-red)",
        'sports-blue': "var(--sports-blue)",
      },
      fontFamily: {
        'display': ['var(--font-playfair)', 'Georgia', 'serif'],
        'mono': ['var(--font-jetbrains)', 'Courier New', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 'box-shadow': '0 0 20px rgba(59, 130, 246, 0.5)' },
          '50%': { 'box-shadow': '0 0 40px rgba(59, 130, 246, 0.8)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}