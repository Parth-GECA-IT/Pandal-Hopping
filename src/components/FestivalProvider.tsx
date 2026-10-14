'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  FESTIVAL_STORAGE_KEY,
  FESTIVALS,
  FestivalTheme,
  FestivalType,
  isFestivalType,
} from '@/lib/festival'

interface FestivalContextValue {
  festival: FestivalType
  theme: FestivalTheme
  setFestival: (festival: FestivalType) => void
}

const FestivalContext = createContext<FestivalContextValue | undefined>(undefined)

export function FestivalProvider({ children }: { children: React.ReactNode }) {
  const [festival, setFestivalState] = useState<FestivalType>('ganeshotsav')

  useEffect(() => {
    const stored = window.localStorage.getItem(FESTIVAL_STORAGE_KEY)
    if (isFestivalType(stored)) {
      setFestivalState(stored)
    }
  }, [])

  const setFestival = (next: FestivalType) => {
    setFestivalState(next)
    window.localStorage.setItem(FESTIVAL_STORAGE_KEY, next)
  }

  const value = useMemo(
    () => ({
      festival,
      theme: FESTIVALS[festival],
      setFestival,
    }),
    [festival]
  )

  return <FestivalContext.Provider value={value}>{children}</FestivalContext.Provider>
}

export function useFestival() {
  const context = useContext(FestivalContext)
  if (!context) {
    throw new Error('useFestival must be used within FestivalProvider')
  }
  return context
}
