// /app/success/page.tsx
import SuccessPageClient from './SuccessPageClient';

// ✅ 关键：禁用静态预渲染，强制动态渲染（解决 useSearchParams 预渲染冲突）
export const dynamic = 'force-dynamic';

// ✅ 页面元数据（SEO 优化）
export const metadata = {
  title: 'Payment Verification | Bazi Fortune',
  description: 'Verify your payment and unlock your complete Bazi destiny report',
  robots: 'noindex, nofollow',
};

// ✅ 仅作为路由入口，渲染客户端组件（无其他逻辑）
export default function SuccessPage() {
  return <SuccessPageClient />;
}