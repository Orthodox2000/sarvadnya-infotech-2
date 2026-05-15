import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: false,
  experimental: {
    // Disable the compiler to suppress animation-related warnings and reduce overhead
  },
  allowedDevOrigins: ['26.186.62.193','169.254.141.31','192.168.1.245'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
  },
};

export default nextConfig;