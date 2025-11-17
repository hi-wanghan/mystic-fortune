// /app/success/layout.tsx
export default function SuccessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 无额外布局，直接渲染子组件（符合 Next.js App Router 要求）
  return <>{children}</>;
}