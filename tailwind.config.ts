import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'emerald-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(16, 185, 129, 0.2)', 
            backgroundColor: 'rgba(16, 185, 129, 0.05)',
            borderColor: 'rgba(16, 185, 129, 0.3)' 
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.6)', 
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            borderColor: 'rgba(16, 185, 129, 1)' 
          },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow': 'emerald-glow 2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;