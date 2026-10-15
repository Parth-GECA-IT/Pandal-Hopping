import { CrowdData, PandalLocation } from '@/types/pandal'

export class CrowdService {
  /**
   * Generate realistic crowd data for a pandal based on various factors
   */
  static generateCrowdData(pandal: PandalLocation): CrowdData {
    const now = new Date()
    const hour = now.getHours()
    const dayOfWeek = now.getDay()
    
    // Base crowd level based on pandal popularity (from rating)
    const popularityFactor = pandal.rating ? (pandal.rating - 3) / 2 : 0.5 // 0-1 scale
    
    // Time-based factors
    const timeMultiplier = this.getTimeMultiplier(hour)
    const dayMultiplier = this.getDayMultiplier(dayOfWeek)
    const baseCrowd = popularityFactor * timeMultiplier * dayMultiplier
    const estimatedPeople = Math.round(baseCrowd * 1000 + Math.random() * 500) // 0-1500 people
    const queueTime = this.calculateQueueTime(estimatedPeople)
    const darshanWait = Math.round(queueTime * 1.5) // Darshan takes longer than just queue
    
    return {
      current_crowd_level: this.getCrowdLevel(estimatedPeople),
      estimated_people_count: estimatedPeople,
      queue_time_minutes: queueTime,
      darshan_wait_time: darshanWait,
      last_updated: now,
      peak_hours: this.getPeakHours(),
      crowd_trend: this.getCrowdTrend(hour),
      is_live: false
    }
  }

  /**
   * Get time-based multiplier (higher in evenings)
   */
  private static getTimeMultiplier(hour: number): number {
    if (hour >= 6 && hour < 9) return 0.4   // Early morning - moderate
    if (hour >= 9 && hour < 12) return 0.3  // Morning - low
    if (hour >= 12 && hour < 16) return 0.5 // Afternoon - medium
    if (hour >= 16 && hour < 20) return 1.0 // Evening - peak
    if (hour >= 20 && hour < 23) return 0.8 // Night - high
    return 0.2 // Late night/early morning - very low
  }

  /**
   * Get day-based multiplier (weekends busier)
   */
  private static getDayMultiplier(dayOfWeek: number): number {
    if (dayOfWeek === 0 || dayOfWeek === 6) return 1.3 // Weekend
    if (dayOfWeek === 5) return 1.1 // Friday
    return 1.0 // Weekdays
  }

  /**
   * Get festival phase multiplier
   */
  private static getFestivalMultiplier(date: Date): number {
    return 1
  }

  /**
   * Calculate queue time based on crowd size
   */
  private static calculateQueueTime(peopleCount: number): number {
    const basetime = Math.round(peopleCount / 50) // 50 people per minute base rate
    return Math.max(2, basetime)
  }

  /**
   * Determine crowd level category
   */
  private static getCrowdLevel(peopleCount: number): 'low' | 'medium' | 'high' | 'very_high' {
    if (peopleCount < 200) return 'low'
    if (peopleCount < 500) return 'medium'
    if (peopleCount < 800) return 'high'
    return 'very_high'
  }

  /**
   * Get peak hours for each pandal
   */
  private static getPeakHours(): string[] {
    return ['7:00 AM - 9:00 AM', '6:00 PM - 9:00 PM'] // Standard peak hours
  }

  /**
   * Determine crowd trend based on time
   */
  private static getCrowdTrend(hour: number): 'increasing' | 'decreasing' | 'stable' {
    if (hour >= 5 && hour < 8) return 'increasing'   // Morning rush building
    if (hour >= 15 && hour < 19) return 'increasing' // Evening rush building
    if (hour >= 21 && hour < 24) return 'decreasing' // Winding down
    if (hour >= 0 && hour < 5) return 'decreasing'   // Late night decrease
    
    return 'stable' // Other times relatively stable
  }

  /**
   * Get crowd level color for UI
   */
  static getCrowdLevelColor(level: CrowdData['current_crowd_level']): string {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'very_high': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  /**
   * Get crowd level emoji
   */
  static getCrowdLevelEmoji(level: CrowdData['current_crowd_level']): string {
    switch (level) {
      case 'low': return '🟢'
      case 'medium': return '🟡'
      case 'high': return '🟠'
      case 'very_high': return '🔴'
      default: return '⚪'
    }
  }

  /**
   * Get crowd level text
   */
  static getCrowdLevelText(level: CrowdData['current_crowd_level']): string {
    switch (level) {
      case 'low': return 'Light Crowd'
      case 'medium': return 'Moderate Crowd'
      case 'high': return 'Heavy Crowd'
      case 'very_high': return 'Very Crowded'
      default: return 'Unknown'
    }
  }

  /**
   * Format wait time in a user-friendly way
   */
  static formatWaitTime(minutes: number): string {
    if (minutes < 5) return 'No wait'
    if (minutes < 60) return `${minutes} min wait`
    
    const hours = Math.floor(minutes / 60)
    const remainingMins = minutes % 60
    
    if (remainingMins === 0) return `${hours}h wait`
    return `${hours}h ${remainingMins}m wait`
  }

  /**
   * Get recommendation based on crowd data
   */
  static getRecommendation(crowdData: CrowdData): string {
    const { current_crowd_level, queue_time_minutes, crowd_trend } = crowdData
    
    if (current_crowd_level === 'low') {
      return '✅ Great time to visit!'
    }
    
    if (current_crowd_level === 'medium') {
      if (crowd_trend === 'decreasing') {
        return '👍 Good time, crowd is reducing'
      }
      return '⏰ Moderate wait expected'
    }
    
    if (current_crowd_level === 'high') {
      if (crowd_trend === 'decreasing') {
        return '⏳ Wait a bit, crowd is reducing'
      }
      return '⚠️ Long wait expected'
    }
    
    // very_high
    if (crowd_trend === 'decreasing') {
      return '🕐 Consider waiting 30-60 minutes'
    }
    
    return '🚫 Very crowded - come back later'
  }
}
