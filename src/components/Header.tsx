'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, Shield } from 'lucide-react'
import { UserLocation } from '@/types/pandal'
import SimpleLocationButton from './SimpleLocationButton'

interface HeaderProps {
  onLocationUpdate: (location: UserLocation) => void
  userLocation?: UserLocation
}

export default function Header({ onLocationUpdate, userLocation }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative z-20 border-b border-slate-200 bg-white text-slate-900 shadow-sm" aria-label="Main navigation">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label="Nagpur Utsav Map home">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-orange-100 text-orange-700">
            <MapPin className="h-4 w-4" />
          </span>
          <span className="truncate text-base font-semibold">Nagpur Utsav Map</span>
        </Link>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md text-slate-700 transition hover:bg-slate-100"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-controls="main-menu"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {isMenuOpen && (
        <nav id="main-menu" className="absolute right-4 top-full mt-1 w-72 space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-xl" aria-label="Main menu">
          {userLocation ? (
            <div className="rounded-md bg-slate-50 p-3 text-sm">
              <p className="font-medium text-slate-800">Location enabled</p>
              <p className="mt-1 text-xs text-slate-500">Accuracy: about {Math.round(userLocation.accuracy || 0)} m</p>
            </div>
          ) : (
            <SimpleLocationButton onLocationUpdate={onLocationUpdate} />
          )}
          <Link
            href="/admin"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-slate-100"
            onClick={() => setIsMenuOpen(false)}
          >
            <Shield className="h-4 w-4 text-slate-500" />
            <span className="font-medium">Manage pandals</span>
          </Link>
        </nav>
      )}
    </header>
  )
}
