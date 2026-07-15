import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    const proxyTarget = process.env.ADMIN_API_PROXY_URL ?? "http://localhost:8080";

    return [
      {
        source: "/rest/api/:path*",
        destination: `${proxyTarget}/rest/api/:path*`,
      },
      {
        source: "/auth/:path*",
        destination: `${proxyTarget}/auth/:path*`,
      },
      {
        source: "/admin/rest/:path*",
        destination: `${proxyTarget}/admin/rest/:path*`,
      },
    ];
  },
};

export default nextConfig;
