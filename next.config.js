/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Turbopack (default in Next.js 16)
  turbopack: {},
  // Keep webpack config for fallback compatibility
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    });
    return config;
  },
};

module.exports = nextConfig;