const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // Додайте інші налаштування PWA якщо потрібно
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Застосування цих заголовків до всіх маршрутів у вашому додатку.
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },
  // Тут можна додати інші налаштування для Next.js, якщо потрібно
};

module.exports = withPWA(nextConfig);