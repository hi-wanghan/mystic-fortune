import './globals.css'
export const metadata = { title: 'BaZi Fortune', description: 'Discover your destiny' }
export default function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>
}