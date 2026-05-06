/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule: any) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: fileLoaderRule.issuer,
      resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
      use: ["@svgr/webpack"],
    });

    fileLoaderRule.exclude = /\.svg$/i;

  },

  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },

  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/images/**",
        
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
};

export default nextConfig;
