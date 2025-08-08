/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Added this line to fix the routes-manifest.json issue
};

module.exports = nextConfig;
