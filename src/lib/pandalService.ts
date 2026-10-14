import { supabase } from './supabase'
import { PandalLocation } from '@/types/pandal'
import { CrowdService } from './crowdService'

export class PandalService {
  // Get all pandals
  static async getAllPandals(): Promise<PandalLocation[]> {
    try {
      // Check if we have valid Supabase configuration
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl === 'demo-mode' || supabaseKey === 'demo-mode') {
        console.log('📝 Using fallback data (no database configured)')
        return this.getFallbackData()
      }

      const { data, error } = await supabase
        .from('pandals')
        .select('*')
        .order('name')
      
      if (error) {
        console.log('📝 Database error, using fallback data:', error.message)
        return this.getFallbackData()
      }
      
      const pandalsWithCrowd = (data || this.getFallbackData()).map(pandal => ({
        ...pandal,
        crowd_data: CrowdService.generateCrowdData(pandal)
      }))
      return pandalsWithCrowd
    } catch (error) {
      console.log('📝 Connection error, using fallback data:', error)
      return this.getFallbackData()
    }
  }

  // Get pandals near a location (within radius in km)
  static async getNearbyPandals(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 10
  ): Promise<PandalLocation[]> {
    try {
      // For Supabase with PostGIS, we can use proper geospatial queries
      // For now, using client-side filtering as fallback
      const allPandals = await this.getAllPandals()
      
      return allPandals.filter(pandal => {
        const distance = this.calculateDistance(
          latitude, longitude, 
          pandal.latitude, pandal.longitude
        )
        return distance <= radiusKm
      })
    } catch (error) {
      console.error('Error fetching nearby pandals:', error)
      return this.getFallbackData()
    }
  }

  // Calculate distance between two points using Haversine formula
  static calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371 // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const d = R * c // Distance in km
    return d
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180)
  }

  // Add a new pandal
  static async addPandal(pandal: Omit<PandalLocation, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
    try {
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
    } catch (error) {
      console.error('Error adding pandal:', error)
      throw error
    }
  }

  // Get fallback data when database is not available
  static getFallbackData(): PandalLocation[] {
    const sampleData = this.getSamplePandals()
    return sampleData.map((pandal, index) => {
      const pandalWithMeta = {
        ...pandal,
        id: `fallback-${index}`,
        created_at: new Date(),
        updated_at: new Date()
      }
      return {
        ...pandalWithMeta,
        crowd_data: CrowdService.generateCrowdData(pandalWithMeta)
      }
    })
  }

  // Get sample data for development and fallback - Real Pune Ganapati Pandals
  static getSamplePandals(): Omit<PandalLocation, 'id' | 'created_at' | 'updated_at'>[] {
    return [
      {
      name: "Abhyankar Nagar Durga Puja Pandal",
      description: "Famous for creating Nagpur’s most gargantuan and grandest royal darbar structures that attract lakhs of visitors every year.",
      address: "Abhyankar Nagar Rd, Madhav Nagar (Near Abhyankar Nagar Chowk), Nagpur, Maharashtra 440010",
      latitude: 21.1278,
      longitude: 79.0561,
      contact: "+91-84828-17786",
      timings: "5:00 AM - 12:00 AM",
      special_features: ["Nagpur's Grandest Royal Court", "Historical Significance", "Maha Aarti Rituals", "Baahubali-Style Darshan"],
      rating: 4.8
      },
      {
      name: "8 Rasta Square Durga Puja (Laxmi Nagar)",
      description: "Celebrated for its breathtaking Kolkata Mayur (Peacock) Palace theme and stunning illumination displays managed by Rani Laxmibai Mandal.",
      address: "Volleyball Ground, near Aath Rasta Chowk (Laxmi Nagar), Nagpur, Maharashtra 440022",
      latitude: 21.1226,
      longitude: 79.0639,
      contact: "Not Publicly Listed",
      timings: "6:00 AM - 11:30 PM",
      special_features: ["The Illumination Capital", "Historical Significance", "Open-Air Cultural Recitals", "Kolkata Mayur Palace Darshan"],
      rating: 4.7
      },
      {
      name: "Ravi Nagar Ground Durga Puja Pandal",
      description: "Renowned for setting up massive historical replicas, including a spectacular Rajgad Fort Maratha heritage theme by Maa Nav Durga Utsav Mandal.",
      address: "Maa Nav Durga Utsav Mandal, NIT Ground, Ravi Nagar (Uday Nagar), Nagpur, Maharashtra 440001",
      latitude: 21.1521,
      longitude: 79.0558,
      contact: "+91-73978-46351",
      timings: "5:30 AM - 11:30 PM",
      special_features: ["The Maratha Heritage Fortress", "Historical Significance", "Dhol Tasha Pathrak Processions", "Rajgad Fort Darshan"],
      rating: 4.6
      },
      {
      name: "Itwari Durga Puja Pandal (Nehru Putla)",
      description: "A major crowd-puller situated in Nagpur's traditional commercial hub, famous for bringing international wonders to life like highly detailed Egypt themes.",
      address: "Nehru Putla Square, Near Nehru Park, Itwari, Lalganj, Nagpur, Maharashtra 440002",
      latitude: 21.1511,
      longitude: 79.1028,
      contact: "Not Publicly Listed",
      timings: "6:00 AM - 1:00 AM",
      special_features: ["The Global Wonder Exhibit", "Historical Significance", "Massive Annadan Feeds", "Egyptian Fantasy Darshan"],
      rating: 4.6
      },
      {
      name: "Ambajhari Durga Utsav",
      description: "A 50+ year-old traditional celebration highly popular for its serene community vibe, authentic rituals, and clay artwork near the lake area.",
      address: "Ambazari Road, Near Shankar Nagar / Ambazari Lake, Nagpur, Maharashtra 440010",
      latitude: 21.1341,
      longitude: 79.0446,
      contact: "Not Publicly Listed",
      timings: "5:00 AM - 11:00 PM",
      special_features: ["The Lakeside Sanctuary", "Historical Significance", "Authentic Sandhi Puja Timelines", "Serene Clay Art Darshan"],
      rating: 4.7
      },
      {
      name: "Jaripatka Durga Puja Mandals",
      description: "The central hub for unique concepts and vibrant neighborhood setups, famously known for hosting the majestic Jaripatka ki Rajmata.",
      address: "Dayanand Park Ground (and adjacent lanes), Jaripatka, Nagpur, Maharashtra 440014",
      latitude: 21.1841,
      longitude: 79.0908,
      contact: "Not Publicly Listed",
      timings: "6:00 AM - 12:00 AM",
      special_features: ["The Festive Multimandal Hub", "Historical Significance", "Vibrant Sindhi Community Custom Rituals", "Rajmata Style Darshan"],
      rating: 4.5
      },
      {
      name: "Ujwal Nagar Ground Durga Puja Pandal",
      description: "A landmark destination specifically known for replicating the iconic structural architecture of the Kolhapur Mahalakshmi Temple.",
      address: "Ujwal Nagar Ground, Wardha Road (Near Somalwar High School), Nagpur, Maharashtra 440025",
      latitude: 21.1035,
      longitude: 79.0712,
      contact: "Not Publicly Listed",
      timings: "6:00 AM - 11:00 PM",
      special_features: ["The Divine Temple Replica", "Historical Significance", "Vedic Chandi Homa Fire Rituals", "Kolhapur Mahalakshmi Darshan"],
      rating: 4.5
      },
      {
      name: "Khamla Sindhi Colony Durga Puja Pandal",
      description: "A massive viral attraction recreating the distinct, intricate South Indian architecture of Telangana's famous Laxmi Narasimha temple.",
      address: "Sindhi Colony Ground, Khamla, Nagpur, Maharashtra 440025",
      latitude: 21.1092,
      longitude: 79.0574,
      contact: "Not Publicly Listed",
      timings: "5:30 AM - 12:30 AM",
      special_features: ["The Southern Architectural Landmark", "Historical Significance", "Garba-Dandiya Fusion Rituals", "Telangana Laxmi Narasimha Darshan"],
      rating: 4.8
      }
    ]      
  }
}