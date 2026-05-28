/** @type {import('next').NextConfig} */
const nextConfig = {
  // standalone mode is highly recommended for Docker/cloud deployments as it creates a highly optimized production bundle containing only the required node_modules.
  output: 'standalone',
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
