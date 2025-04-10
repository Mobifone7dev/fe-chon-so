/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXTAUTH_APP_API_URL: process.env.NEXTAUTH_APP_API_URL,
    NEXTAUTH_APP_API_URL_SSL: process.env.NEXTAUTH_APP_API_URL_SSL,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  },
  webpack(config) {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  }
};

module.exports = nextConfig;
