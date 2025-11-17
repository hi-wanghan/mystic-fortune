/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' https://js.stripe.com", // 允许 Stripe 脚本
              "frame-src https://js.stripe.com https://checkout.stripe.com", // 允许 Stripe 支付框
              "style-src 'self' 'unsafe-inline'", // 允许内联样式（Next.js 必需）
              "img-src 'self' data: https://*.stripe.com", // 允许 Stripe 图片
              "connect-src 'self' https://api.stripe.com", // 允许 Stripe API 请求
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;