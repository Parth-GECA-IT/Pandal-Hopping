'use client'

import { useState } from 'react'
import { UserLocation } from '@/types/pandal'
import SimpleLocationButton from './SimpleLocationButton'
import FestivalSwitcher from './FestivalSwitcher'
import { useFestival } from './FestivalProvider'
import { Menu, X, MapPin, Compass, Shield } from 'lucide-react'
import Link from 'next/link'

interface HeaderProps {
  onLocationUpdate: (location: UserLocation) => void
  userLocation?: UserLocation
}

export default function Header({ onLocationUpdate, userLocation }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme } = useFestival()

  return (
    <header
      className={`bg-gradient-to-r ${theme.headerGradient} text-white shadow-2xl relative overflow-hidden`}
      role="banner"
      aria-label="Main navigation"
    >
      <div className="absolute inset-0 bg-black/10" aria-hidden="true"></div>
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='0.3'%3E%3Cpath d='M20 20c0 11-9 20-20 20s-20-9-20-20 9-20 20-20 20 9 20 20zm-2 0c0-9.9-8.1-18-18-18s-18 8.1-18 18 8.1 18 18 18 18-8.1 18-18z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white/20 rounded-full backdrop-blur-sm flex-shrink-0">
              <img
                src="/markers/img1.png"
                alt={theme.markerAlt}
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent truncate">
                {theme.appName}
              </h1>
              <p className="text-white/90 text-xs sm:text-sm flex items-center gap-1 truncate">
                <Compass className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                <span className="truncate">{theme.tagline}</span>
              </p>
            </div>
          </div>

          <div className="hidden md:flex">
            <FestivalSwitcher />
          </div>

          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            {userLocation ? (
              <div className="flex items-center gap-2 xl:gap-3 bg-white/20 backdrop-blur-sm rounded-lg px-3 xl:px-4 py-2">
                <MapPin className="w-4 h-4 xl:w-5 xl:h-5 text-green-300 flex-shrink-0" />
                <div className="text-right">
                  <p className="text-xs xl:text-sm text-green-200 font-medium">Location Found</p>
                  <p className="text-xs text-white/80">
                    Accuracy: ~{Math.round(userLocation.accuracy || 0)}m
                  </p>
                </div>
              </div>
            ) : (
              <SimpleLocationButton onLocationUpdate={onLocationUpdate} />
            )}

            <Link
              href="/admin"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-2 xl:px-3 py-2 transition-colors flex items-center gap-1 xl:gap-2 text-xs xl:text-sm"
              title="Admin Panel"
              aria-label="Access admin panel"
            >
              <Shield className="w-3 h-3 xl:w-4 xl:h-4" />
              <span className="hidden xl:inline">Admin</span>
            </Link>
          </div>

          <button
            className="lg:hidden bg-white/20 p-2 rounded-lg backdrop-blur-sm flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

        <div className="md:hidden mt-3 flex justify-center">
          <FestivalSwitcher compact />
        </div>

        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden mt-3 sm:mt-4 space-y-3 sm:space-y-4 bg-white/10 backdrop-blur-sm rounded-lg p-3 sm:p-4"
            role="navigation"
            aria-label="Mobile navigation menu"
          >
            {userLocation ? (
              <div className="flex items-center gap-3 p-2 bg-white/10 rounded-lg">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-green-200 font-medium">Location Found</p>
                  <p className="text-xs text-white/80 truncate">Ready to find nearby Nagpur pandals</p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <SimpleLocationButton onLocationUpdate={onLocationUpdate} />
              </div>
            )}

            <Link
              href="/admin"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2 sm:py-3 transition-colors flex items-center gap-2 sm:gap-3 w-full"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Access admin panel"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">Admin Panel</span>
            </Link>
          </div>
        )}

        {!userLocation && !isMenuOpen && (
          <div className="lg:hidden mt-3 sm:mt-4 flex justify-center">
            <SimpleLocationButton onLocationUpdate={onLocationUpdate} />
          </div>
        )}

        <div className="mt-3 sm:mt-4 bg-white/90 text-gray-900 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-lg backdrop-blur-sm">
          <p className="text-xs sm:text-sm md:text-base font-semibold text-center flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
            <span className="text-sm sm:text-base md:text-lg flex-shrink-0">🎉</span>
            <span className="text-center">{theme.banner}</span>
            <span className="text-sm sm:text-base md:text-lg flex-shrink-0">🎉</span>
          </p>
          <p className="text-xs text-center mt-1 text-gray-600">
            {userLocation
              ? `Showing ${theme.shortName} pandals within 25km of your location`
              : `Map centered on Nagpur · switch festival anytime — one at a time`}
          </p>
        </div>
      </div>
    </header>
  )
}
