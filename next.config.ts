import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Biar nggak ganggu pas ngoding
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // PANCINGAN UTAMA: Beri tahu Next.js untuk menerima Turbopack meskipun ada plugin
  turbopack: {}, 
  
  // Jika masih error, gunakan ini sebagai cadangan:
  experimental: {
    turbo: {
      // Biarkan kosong atau tambahkan rules jika diperlukan nanti
    },
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
