'use client'

import { NAGPUR_AREAS, NAGPUR_CENTER } from '@/lib/festival'
import { useFestival } from './FestivalProvider'

interface CityExplorerProps {
  pandalCount: number
  hasUserLocation: boolean
  onAreaSelect: (latitude: number, longitude: number, zoom?: number) => void
}

export default function CityExplorer({
  pandalCount,
  hasUserLocation,
  onAreaSelect,
}: CityExplorerProps) {
  const { theme } = useFestival()

  return (
    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-auto z-10 max-w-full sm:max-w-sm pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 text-xs text-gray-600 shadow-lg border border-white/20">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="min-w-0">
            <p className={`font-bold ${theme.accentText} text-sm truncate`}>{theme.appName}</p>
            <p className="text-[10px] uppercase tracking-wide text-gray-500">
              {theme.city} · {theme.shortName} · one at a time
            </p>
          </div>
          {pandalCount > 0 && (
            <span className="shrink-0 bg-orange-50 text-orange-800 font-medium text-[11px] px-2 py-1 rounded-full">
              {pandalCount} pandals
            </span>
          )}
        </div>

        <p className="hidden sm:block leading-relaxed text-xs mb-2">{theme.footerBlurb}</p>

        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-0.5 px-0.5">
          <button
            type="button"
            onClick={() => onAreaSelect(NAGPUR_CENTER.latitude, NAGPUR_CENTER.longitude, 12)}
            className="shrink-0 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-[11px] font-medium text-gray-700"
          >
            City centre
          </button>
          {NAGPUR_AREAS.map((area) => (
            <button
              key={area.name}
              type="button"
              onClick={() => onAreaSelect(area.latitude, area.longitude, 14)}
              className="shrink-0 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-[11px] font-medium text-gray-700"
            >
              {area.name}
            </button>
          ))}
        </div>

        <p className="mt-1.5 text-[10px] text-gray-400">
          {hasUserLocation ? 'Location on · nearby first' : 'Share location or jump to an area'} · Parth Armarkar
        </p>
      </div>
    </div>
  )
}
