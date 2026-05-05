/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (process.env.NEXT_PUBLIC_DISABLE_HOT_RELOAD === "true" && !isServer) {
      config.devServer = { hot: false }; // Disables Webpack hot reload
    }
    return config;
  },
};

export default nextConfig;
