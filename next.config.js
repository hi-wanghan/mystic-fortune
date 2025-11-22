// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' https://js.stripe.com 'unsafe-eval'", // 解决 eval 警告
              "style-src 'self' 'unsafe-inline'", // 允许内联样式
              "img-src 'self' data:",
              // 关键：修正 Supabase 域名后缀为 .co，确保和实际请求一致
              "connect-src 'self' http://localhost:3000 https://api.stripe.com https://ysdboqwidgvtmqjdnzmo.supabase.co",
              "frame-src https://js.stripe.com", // Stripe 支付弹窗需要
              "object-src 'none'"
            ].join('; ')
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;