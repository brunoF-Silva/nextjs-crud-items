import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
      domains: [
        'images3.kabum.com.br',
        'images7.kabum.com.br',
        'images4.kabum.com.br',
        'images0.kabum.com.br',
        'images9.kabum.com.br',
        'images2.kabum.com.br',
        'files.tecnoblog.net'
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
