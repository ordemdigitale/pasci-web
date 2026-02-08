import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/static/**',
      },
      {
        protocol: 'https',
        hostname: 'api.plateforme-osci.org',
        pathname: '/static/**',
      },
      {
        protocol: 'http',
        hostname: 'api.plateforme-osci.org',
        pathname: '/static/**',
      },
    ],
  },
};

export default nextConfig;
