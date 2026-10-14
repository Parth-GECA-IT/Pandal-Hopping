import { supabase } from './supabase'
import { PandalLocation } from '@/types/pandal'
import { CrowdService } from './crowdService'
import { FestivalType, inferFestival } from './festival'

export class PandalService {
  static matchesFestival(pandal: Pick<PandalLocation, 'name' | 'description' | 'festival'>, festival?: FestivalType): boolean {
    if (!festival) return true
    const tagged = pandal.festival || inferFestival(pandal.name, pandal.description)
    return tagged === festival
  }

  static isInNagpur(pandal: Pick<PandalLocation, 'latitude' | 'longitude'>): boolean {
    return (
      pandal.latitude >= 20.85 &&
      pandal.latitude <= 21.35 &&
      pandal.longitude >= 78.85 &&
      pandal.longitude <= 79.25
    )
  }

  // Get all pandals
  static async getAllPandals(festival?: FestivalType): Promise<PandalLocation[]> {
    try {
      // Check if we have valid Supabase configuration
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl === 'demo-mode' || supabaseKey === 'demo-mode') {
        console.log('📝 Using fallback data (no database configured)')
        return this.getFallbackData(festival)
      }

      const { data, error } = await supabase
        .from('pandals')
        .select('*')
        .order('name')
      
      if (error) {
        console.log('📝 Database error, using fallback data:', error.message)
        return this.getFallbackData(festival)
      }

      const nagpurRows = (data || []).filter((pandal: PandalLocation) => this.isInNagpur(pandal))
      const source = nagpurRows.length > 0 ? nagpurRows : this.getFallbackData(festival)
      
      const pandalsWithCrowd = source
        .filter((pandal: PandalLocation) => this.matchesFestival(pandal, festival))
        .map((pandal: PandalLocation) => ({
          ...pandal,
          festival: pandal.festival || inferFestival(pandal.name, pandal.description),
          crowd_data: CrowdService.generateCrowdData(pandal)
        }))
      return pandalsWithCrowd
    } catch (error) {
      console.log('📝 Connection error, using fallback data:', error)
      return this.getFallbackData(festival)
    }
  }

  // Get pandals near a location (within radius in km)
  static async getNearbyPandals(
    latitude: number, 
    longitude: number, 
    radiusKm: number = 10,
    festival?: FestivalType
  ): Promise<PandalLocation[]> {
    try {
      // For Supabase with PostGIS, we can use proper geospatial queries
      // For now, using client-side filtering as fallback
      const allPandals = await this.getAllPandals(festival)
      
      return allPandals.filter(pandal => {
        const distance = this.calculateDistance(
          latitude, longitude, 
          pandal.latitude, pandal.longitude
        )
        return distance <= radiusKm
      })
    } catch (error) {
      console.error('Error fetching nearby pandals:', error)
      return this.getFallbackData(festival)
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
  static getFallbackData(festival?: FestivalType): PandalLocation[] {
    const sampleData = this.getSamplePandals().filter((pandal) => this.matchesFestival(pandal, festival))
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

  // Demo/fallback listings for Nagpur. Production pandal rows should come from your database.
  static getSamplePandals(): Omit<PandalLocation, 'id' | 'created_at' | 'updated_at'>[] {
    return [
      {
      name: "Tekdi Ganesh Mandir",
      description: "Nagpur's beloved hilltop Ganesh temple — a landmark Ganeshotsav destination with panoramic city views and continuous darshan.",
      address: "Ganesh Tekdi, Near Sitabuldi, Nagpur, Maharashtra 440001",
      latitude: 21.1542,
      longitude: 79.0798,
      timings: "5:00 AM - 11:00 PM",
      special_features: ["Hilltop Darshan", "City Landmark", "Morning & Evening Aarti"],
      rating: 4.8,
      festival: "ganeshotsav"
      },
      {
      name: "Mahal Ganeshotsav Mandal",
      description: "A heritage-area Ganeshotsav celebration in old Nagpur, known for traditional aarti, community gatherings, and festive processions.",
      address: "Mahal, Nagpur, Maharashtra 440002",
      latitude: 21.1462,
      longitude: 79.1090,
      timings: "6:00 AM - 12:00 AM",
      special_features: ["Old City Celebration", "Cultural Programs", "Visarjan Procession"],
      rating: 4.6,
      festival: "ganeshotsav"
      },
      {
      name: "Sitabuldi Ganeshotsav Pandal",
      description: "Central Nagpur Ganeshotsav pandal near the commercial hub — easy to visit, brightly decorated, and popular with families.",
      address: "Sitabuldi, Nagpur, Maharashtra 440012",
      latitude: 21.1498,
      longitude: 79.0822,
      timings: "6:00 AM - 11:30 PM",
      special_features: ["Central Location", "Illumination", "Family Friendly"],
      rating: 4.5,
      festival: "ganeshotsav"
      },
      {
      name: "Dharampeth Ganeshotsav Mandal",
      description: "West Nagpur community Ganeshotsav known for themed decoration, evening cultural events, and lively neighbourhood crowds.",
      address: "Dharampeth, Nagpur, Maharashtra 440010",
      latitude: 21.1406,
      longitude: 79.0615,
      timings: "6:00 AM - 11:00 PM",
      special_features: ["Themed Decoration", "Cultural Evenings", "West Nagpur"],
      rating: 4.5,
      festival: "ganeshotsav"
      },
      {
      name: "Sadar Ganeshotsav Pandal",
      description: "North-central Nagpur Ganeshotsav stop popular with cantonment-area devotees, with classic idol display and aarti.",
      address: "Sadar, Nagpur, Maharashtra 440001",
      latitude: 21.1610,
      longitude: 79.0805,
      timings: "5:30 AM - 11:00 PM",
      special_features: ["Classic Idol", "Aarti", "Cantonment Area"],
      rating: 4.4,
      festival: "ganeshotsav"
      },
      {
      name: "Itwari Ganeshotsav Mandal",
      description: "Traditional market-area Ganeshotsav in Itwari, blending old-Nagpur energy with colourful pandal art and late-evening darshan.",
      address: "Itwari, Nagpur, Maharashtra 440002",
      latitude: 21.1518,
      longitude: 79.1088,
      timings: "6:00 AM - 12:30 AM",
      special_features: ["Market Hub", "Night Darshan", "Traditional Decor"],
      rating: 4.4,
      festival: "ganeshotsav"
      },
      {
      name: "Abhyankar Nagar Durga Puja Pandal",
      description: "Famous for creating Nagpur’s most gargantuan and grandest royal darbar structures that attract lakhs of visitors every year.",
      address: "Abhyankar Nagar Rd, Madhav Nagar (Near Abhyankar Nagar Chowk), Nagpur, Maharashtra 440010",
      latitude: 21.1278,
      longitude: 79.0561,
      contact: "+91-84828-17786",
      timings: "5:00 AM - 12:00 AM",
      special_features: ["Nagpur's Grandest Royal Court", "Historical Significance", "Maha Aarti Rituals", "Baahubali-Style Darshan"],
      rating: 4.8,
      festival: "durga-utsav"
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
      rating: 4.7,
      festival: "durga-utsav"
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
      rating: 4.6,
      festival: "durga-utsav"
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
      rating: 4.6,
      festival: "durga-utsav"
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
      rating: 4.7,
      festival: "durga-utsav"
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
      rating: 4.5,
      festival: "durga-utsav"
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
      rating: 4.5,
      festival: "durga-utsav"
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
      rating: 4.8,
      festival: "durga-utsav"
      }
    ]      
  }
}