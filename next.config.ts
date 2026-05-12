import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: ['10.10.7.37', '192.168.1.202'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'fdn2.gsmarena.com',
      },
      {
        protocol: 'https',
        hostname: 'www.mamp.one',
      },
      {
        protocol: 'https',
        hostname: 't3.ftcdn.net',
      },
      {
        protocol: 'http',
        hostname: '10.10.7.55',
      },
      {
        protocol: 'https',
        hostname: 'hz2w208g-5006.inc1.devtunnels.ms',
      },
    ],
  },
};

export default nextConfig;
