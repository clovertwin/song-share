/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "platform-lookaside.fbsbx.com",
      "mosaic.scdn.co",
      "i.scdn.co",
      "res.cloudinary.com",
    ],
  },
};

module.exports = nextConfig;
