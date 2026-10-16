'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Shield, Mail } from 'lucide-react'
import { UserLocation } from '@/types/pandal'
import SimpleLocationButton from './SimpleLocationButton'

interface HeaderProps {
  onLocationUpdate: (location: UserLocation) => void
  userLocation?: UserLocation
}

export default function Header({ onLocationUpdate, userLocation }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative z-40 bg-gradient-to-r from-orange-700 via-amber-500 to-orange-700 text-slate-900 shadow-sm" aria-label="Main navigation">
      <div className="container mx-auto flex h-9 items-center justify-between px-3 sm:px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2" aria-label="Nagpur Pandal Map home">
          <img src="/markers/logo1.png" alt="" className="h-6 w-6 flex-shrink-0 object-contain" />
          <span className="truncate text-white text-sm font-semibold sm:text-base">Nagpur Pandal Map</span>
        </Link>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-md text-orange-800 transition hover:bg-orange-200/70"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="main-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
        </button>
      </div>
      {isMenuOpen && (
        <nav id="main-menu" className="absolute right-3 top-full z-50 mt-1 w-72 space-y-3 rounded-lg border border-orange-200 bg-white p-4 shadow-xl sm:right-4" aria-label="Main menu">
          {userLocation ? (
            <div className="rounded-md bg-orange-50 p-3 text-sm">
              <p className="font-medium text-slate-800">Location enabled</p>
              <p className="mt-1 text-xs text-slate-500">Accuracy: about {Math.round(userLocation.accuracy || 0)} m</p>
            </div>
          ) : (
            <SimpleLocationButton onLocationUpdate={onLocationUpdate} />
          )}
          <Link
            href="/admin"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-orange-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <Shield className="h-4 w-4 text-orange-700" />
            <span className="font-medium">Manage pandals</span>
          </Link>
          <Link
            href="/contact"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-orange-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <Mail className="h-4 w-4 text-orange-700" />
            <span className="flex min-w-0 flex-col">
              <span className="font-medium">Contact to add or edit a pandal</span>
              <span className="truncate text-xs text-slate-500">View instructions and email us</span>
            </span>
          </Link>
        </nav>
      )}
    </header>
  )
}
