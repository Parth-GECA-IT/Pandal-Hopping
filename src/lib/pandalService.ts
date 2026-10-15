import { supabase } from './supabase'
import { PandalLocation } from '@/types/pandal'
import { CrowdService } from './crowdService'
import { FestivalId } from './festivals'

export class PandalService {
  static async getAllPandals(festivalId: FestivalId): Promise<PandalLocation[]> {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseKey || supabaseUrl === 'demo-mode' || supabaseKey === 'demo-mode') {
        return []
      }

      const { data, error } = await supabase
        .from('pandals')
        .select('*')
        .eq('festival_id', festivalId)
        .order('name')

      if (error) {
        console.error('Unable to load pandals:', error.message)
        return []
      }

      return (data || []).map(pandal => ({
        ...pandal,
        crowd_data: CrowdService.generateCrowdData(pandal)
      }))
    } catch (error) {
      console.error('Unable to connect to the pandal database:', error)
      return []
    }
  }

  static async getNearbyPandals(
    latitude: number,
    longitude: number,
    festivalId: FestivalId,
    radiusKm: number = 10
  ): Promise<PandalLocation[]> {
    const allPandals = await this.getAllPandals(festivalId)
    return allPandals.filter(pandal => this.calculateDistance(
      latitude,
      longitude,
      pandal.latitude,
      pandal.longitude
    ) <= radiusKm)
  }

  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const earthRadiusKm = 6371
    const latitudeDelta = this.deg2rad(lat2 - lat1)
    const longitudeDelta = this.deg2rad(lon2 - lon1)
    const haversine = Math.sin(latitudeDelta / 2) ** 2
      + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2))
      * Math.sin(longitudeDelta / 2) ** 2
    return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
  }

  private static deg2rad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  static async addPandal(pandal: Omit<PandalLocation, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    const { data, error } = await supabase
      .from('pandals')
      .insert([{
        ...pandal,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()

    if (error) throw error
    return data.id
  }

  static getSamplePandals(): Omit<PandalLocation, 'id' | 'created_at' | 'updated_at'>[] {
    return []
  }
}
