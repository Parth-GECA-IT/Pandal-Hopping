'use client'

import { PandalLocation } from '@/types/pandal'
import { Users } from 'lucide-react'

interface CrowdSummaryProps {
  pandals: PandalLocation[]
}

export default function CrowdSummary({ pandals }: CrowdSummaryProps) {
  const pandalsWithCrowd = pandals.filter(pandal => pandal.crowd_data)
  if (pandalsWithCrowd.length === 0) return null

  const totalPeople = pandalsWithCrowd.reduce(
    (sum, pandal) => sum + (pandal.crowd_data?.estimated_people_count || 0),
    0
  )
  const averageWait = Math.round(pandalsWithCrowd.reduce(
    (sum, pandal) => sum + (pandal.crowd_data?.darshan_wait_time || 0),
    0
  ) / pandalsWithCrowd.length)
  const crowdStats = {
    low: pandalsWithCrowd.filter(pandal => pandal.crowd_data?.current_crowd_level === 'low').length,
    medium: pandalsWithCrowd.filter(pandal => pandal.crowd_data?.current_crowd_level === 'medium').length,
    high: pandalsWithCrowd.filter(pandal => pandal.crowd_data?.current_crowd_level === 'high').length,
    veryHigh: pandalsWithCrowd.filter(pandal => pandal.crowd_data?.current_crowd_level === 'very_high').length,
  }
  const total = pandalsWithCrowd.length

  return (
    <section className="w-full rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 p-2.5 shadow-lg sm:p-3" aria-label="Crowd estimates">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-1.5 text-xs font-bold text-orange-950 sm:text-sm">
          <Users className="h-4 w-4 text-orange-700" />
          Crowd Estimates
        </h2>
        <span className="text-[9px] text-slate-500 sm:text-[10px]">Illustrative only</span>
      </div>

      <div className="mb-2 grid grid-cols-2 gap-1.5">
        <div className="rounded-md bg-white/80 p-1.5 text-center">
          <div className="text-sm font-bold text-orange-800 sm:text-base">{totalPeople.toLocaleString()}</div>
          <div className="text-[9px] text-slate-600 sm:text-[10px]">Estimated visitors</div>
        </div>
        <div className="rounded-md bg-white/80 p-1.5 text-center">
          <div className="text-sm font-bold text-amber-800 sm:text-base">{averageWait}m</div>
          <div className="text-[9px] text-slate-600 sm:text-[10px]">Average wait</div>
        </div>
        <div className="rounded-md bg-white/80 p-1.5 text-center">
          <div className="text-sm font-bold text-emerald-700 sm:text-base">{crowdStats.low}</div>
          <div className="text-[9px] text-slate-600 sm:text-[10px]">Light crowd</div>
        </div>
        <div className="rounded-md bg-white/80 p-1.5 text-center">
          <div className="text-sm font-bold text-rose-700 sm:text-base">{crowdStats.veryHigh}</div>
          <div className="text-[9px] text-slate-600 sm:text-[10px]">Very crowded</div>
        </div>
      </div>

      <div className="mb-1 text-[9px] font-medium text-slate-600">Crowd distribution</div>
      <div className="flex h-1.5 overflow-hidden rounded-full bg-slate-200" aria-label="Crowd distribution">
        <div className="bg-emerald-500" style={{ width: `${(crowdStats.low / total) * 100}%` }} />
        <div className="bg-amber-400" style={{ width: `${(crowdStats.medium / total) * 100}%` }} />
        <div className="bg-orange-500" style={{ width: `${(crowdStats.high / total) * 100}%` }} />
        <div className="bg-rose-600" style={{ width: `${(crowdStats.veryHigh / total) * 100}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-[8px] text-slate-600 sm:text-[9px]">
        <span>Light</span>
        <span>Moderate</span>
        <span>Heavy</span>
        <span>Very crowded</span>
      </div>
    </section>
  )
}
