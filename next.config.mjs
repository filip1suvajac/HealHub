/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (process.env.NEXT_PUBLIC_DISABLE_HOT_RELOAD === "true" && !isServer) {
      config.devServer = { hot: false }; // Disables Webpack hot reload
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "heuqlmqcfusnwzqbjrbe.supabase.co",
        port: "",
        pathname: "/storage/v1/object/(sign|public)/profile-images/profiles/**",
      },
    ],
  },
};

export default nextConfig;
