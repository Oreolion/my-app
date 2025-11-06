/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // This tells Vercel/Next.js to not fail the build if it finds ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // This tells webpack to treat this import as an empty module
    // It resolves the MetaMask SDK build warning
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "@react-native-async-storage/async-storage": false,
    };

    return config;
  },

};

export default nextConfig;
