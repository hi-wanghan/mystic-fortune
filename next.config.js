const { withSecureHeaders } = require('next-secure-headers');

module.exports = withSecureHeaders({
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' https://js.stripe.com; frame-src https://js.stripe.com https://checkout.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:;",
          },
        ],
      },
    ];
  },
  // 其他 Next.js 配置...
});