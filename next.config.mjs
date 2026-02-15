/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    qualities: [75, 85, 90, 100],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.shafranselective.uz",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "shafranselective.uz",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-grocery.billz.io",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
