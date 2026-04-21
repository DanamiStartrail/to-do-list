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
          // 0% dan 100% adalah kondisi saat "redup"
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(16, 185, 129, 0.1)', 
            backgroundColor: 'rgba(16, 185, 129, 0.02)', // Sangat tipis
            borderColor: 'rgba(16, 185, 129, 0.2)',
            transform: 'scale(1)'
          },
          // 50% adalah puncak saat "menyala"
          '50%': { 
            boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)', 
            backgroundColor: 'rgba(16, 185, 129, 0.12)', // Lebih terlihat
            borderColor: 'rgba(16, 185, 129, 0.8)',
            transform: 'scale(1.005)' // Sedikit efek membesar biar terasa dinamis
          },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        // Saya ubah ke 3s biar kedap-kedipnya kalem dan nggak bikin pusing
        'glow': 'emerald-glow 3s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config;