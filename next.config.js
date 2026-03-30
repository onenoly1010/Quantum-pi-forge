/** @type {import('next').NextConfig} */
const deployTarget = process.env.DEPLOY_TARGET || 'cloudflare-pages';
const isGithubPages = deployTarget === 'github-pages';

const nextConfig = {
  output: 'export',
  basePath: isGithubPages ? '/quantum-pi-forge-fixed' : '',
  assetPrefix: isGithubPages ? '/quantum-pi-forge-fixed/' : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
