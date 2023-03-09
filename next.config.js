/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "platform-lookaside.fbsbx.com",
      "mosaic.scdn.co",
      "i.scdn.co",
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig;
