import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
      domains: [
        "images.unsplash.com",
      ],
    },
};

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'images7.kabum.com.br',
//         port: '',
//         pathname: '/**', // This allows all paths on this domain
//       },
//       {
//         protocol: 'https',
//         hostname: 'files.tecnoblog.net',
//         port: '',
//         pathname: '/**',
//       },
//     ],
//   },
// };

module.exports = nextConfig;

export default nextConfig;
