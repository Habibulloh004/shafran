/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.uzlabs.uz",
      },
      {
        protocol: "https",
        hostname: "<accountid>.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "pub-9663a06e424a4b83b79dc3ab241710a4.r2.dev",
      },
    ],
  },

};

export default nextConfig;
