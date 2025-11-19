import './globals.css';

// 1. 删除 SpeedInsights 导入语句
// import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = { 
  title: 'Fortune', 
  description: 'Discover your destiny' 
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 2. 删除重复的 <title> 标签（metadata 会自动生成标题，无需手动写） */}
      </head>
      <body>
        {children}
        {/* 3. 删除 SpeedInsights 组件引用 */}
        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}