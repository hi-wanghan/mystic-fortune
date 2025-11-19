import './globals.css'
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata = { title: 'Fortune', description: 'Discover your destiny' }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
