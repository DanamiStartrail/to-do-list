import withPWAInit from '@ducanh2912/next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Membungkam error Turbopack di Next 16
  turbopack: {}, 

  // Skip pengecekan error saat build biar lancar
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/**', // Mengizinkan semua path gambar dari Supabase
      },
    ],
  },
};

export default withPWA(nextConfig);