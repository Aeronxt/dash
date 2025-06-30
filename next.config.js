/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['stripe.com', 'js.stripe.com'], // Allow Stripe domains
  },
  // Remove 'output: export' to enable API routes for Stripe
  experimental: {
    serverComponentsExternalPackages: ['stripe'],
  },
  webpack: (config) => {
    config.externals = [...config.externals, 'bufferutil', 'utf-8-validate'];
    return config;
  },
};

module.exports = nextConfig;
