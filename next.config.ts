import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Hapus blok experimental dan turbo yang lama
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  // Jika kamu memang butuh fitur eksperimental di masa depan, 
  // baru tambahkan blok experimental di sini. Untuk sekarang, biarkan bersih.
};

export default withPWA(nextConfig);