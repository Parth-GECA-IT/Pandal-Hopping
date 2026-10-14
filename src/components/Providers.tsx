'use client'

import { FestivalProvider, useFestival } from './FestivalProvider'

function ThemedShell({ children }: { children: React.ReactNode }) {
  const { theme } = useFestival()
  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.pageGradient}`}>
      {children}
    </div>
  )
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <FestivalProvider>
      <ThemedShell>{children}</ThemedShell>
    </FestivalProvider>
  )
}
