import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Add API proxy for backend
  async rewrites() {
    // In Docker: backend service is at http://backend:8000
    // In local dev: backend is at http://localhost:8000
    const apiUrl = process.env.API_URL || 'http://localhost:8000';

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
