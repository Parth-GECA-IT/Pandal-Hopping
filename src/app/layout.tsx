import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nagpur Pandal Map | Ganeshotsav and Durga Utsav',
  description: 'Explore verified Ganeshotsav and Durga Utsav pandal locations across Nagpur, one festival at a time.',
  keywords: 'Nagpur, Ganeshotsav, Durga Utsav, pandal, mandal, festival map, Maharashtra',
  authors: [{ name: 'Parth Armarkar' }],
  openGraph: {
    title: 'Nagpur Pandal Map',
    description: 'Find Ganeshotsav and Durga Utsav pandals across Nagpur',
    type: 'website',
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/markers/logo1.png',
    shortcut: '/markers/logo1.png',
    apple: '/markers/logo1.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FF9933',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/markers/logo1.png" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50">
          {children}
        </div>
      </body>
    </html>
  )
}