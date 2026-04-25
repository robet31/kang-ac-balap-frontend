/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: [
      'tvugghippwvoxsjqyxkr.supabase.co', // Supabase storage
      'supabase.co',
      'localhost',
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Environment variables validation
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Sunest Auto',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  // Webpack configuration
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },

  // Experimental features
  experimental: {
    // Enable if needed
    // serverActions: true,
  },

  // Redirects
  async redirects() {
    return [
      // Redirect root to landing page if not authenticated
      // {
      //   source: '/',
      //   destination: '/landing',
      //   permanent: false,
      // },
    ];
  },

  // Rewrites for API routes (if using Supabase Edge Functions)
  async rewrites() {
    return [
      // Example: proxy Supabase functions
      // {
      //   source: '/api/server/:path*',
      //   destination: 'https://tvugghippwvoxsjqyxkr.supabase.co/functions/v1/:path*',
      // },
    ];
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
