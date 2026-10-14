import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Nagpur Pandal Navigator — Ganeshotsav & Durga Utsav',
  description:
    'Find and navigate famous Ganeshotsav and Durga Utsav pandals across Nagpur. Crowd-aware routes, timings, and directions — one festival at a time.',
  keywords:
    'Nagpur, Ganeshotsav, Durga Utsav, Durga Puja, Pandal, Navigation, Maharashtra, Tekdi Ganesh, Abhyankar Nagar',
  authors: [{ name: 'Parth Armarkar' }],
    openGraph: {
    title: 'Nagpur Pandal Navigator',
    description: 'Explore Ganeshotsav and Durga Utsav pandals in Nagpur — one festival at a time.',
    type: 'website',
    locale: 'en_IN',
  },
  manifest: '/manifest.json',
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
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
