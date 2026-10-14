'use client'

import { FestivalType } from '@/lib/festival'
import { useFestival } from './FestivalProvider'

interface FestivalSwitcherProps {
  compact?: boolean
}

const OPTIONS: { id: FestivalType; label: string }[] = [
  { id: 'ganeshotsav', label: 'Ganeshotsav' },
  { id: 'durga-utsav', label: 'Durga Utsav' },
]

export default function FestivalSwitcher({ compact = false }: FestivalSwitcherProps) {
  const { festival, setFestival } = useFestival()

  return (
    <div
      className={`inline-flex rounded-full bg-black/20 p-1 backdrop-blur-sm ${compact ? 'text-xs' : 'text-sm'}`}
      role="tablist"
      aria-label="Choose festival"
    >
      {OPTIONS.map((option) => {
        const active = festival === option.id
        return (
          <button
            key={option.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => setFestival(option.id)}
            className={`rounded-full px-3 py-1.5 font-semibold transition-all ${
              active
                ? 'bg-white text-gray-900 shadow-md'
                : 'text-white/85 hover:bg-white/10 hover:text-white'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
