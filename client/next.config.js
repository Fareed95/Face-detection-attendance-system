const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA({
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: false,
  devIndicators: false,
  images: {
    domains: [
      'images.pexels.com',
      'img.freepik.com',
      'api.microlink.io',
      'images.unsplash.com',
      'media.licdn.com',
      'assets.aceternity.com',
      'cdn.pixabay.com',
      '127.0.0.1',
      'upload.wikimedia.org',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "https://code-cell-website.onrender.com" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ];
  }
});
