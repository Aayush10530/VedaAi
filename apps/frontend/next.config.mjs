/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Mode is enabled for catch-early warnings
  reactStrictMode: true,
  // Ignore typescript and eslint during production builds if checked elsewhere, but here we keep standard safety guards
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
