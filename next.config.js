/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Required for GitHub Pages
  basePath: '/quantum-pi-forge-fixed',
  assetPrefix: '/quantum-pi-forge-fixed/',
  images: {
    unoptimized: true, // Needed for static exports
  },
};

module.exports = nextConfig;
