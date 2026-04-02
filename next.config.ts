/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. TAMBAHKAN INI: Mendiamkan error Turbopack agar mau menerima config Webpack
  turbopack: {},

  // 2. Tetap pertahankan fungsi webpack kosong untuk next-pwa
  webpack: (config) => {
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA(nextConfig);