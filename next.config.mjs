/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  experimental: {
    serverComponentsExternalPackages: ["@resvg/resvg-js"],
  },
};

export default nextConfig;
