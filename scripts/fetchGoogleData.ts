/**
 * Script to fetch real pandal data from Google Maps and update the database
 * Run with: npx ts-node scripts/fetchGoogleData.ts
 */

import { GooglePlacesService } from '../src/lib/googlePlacesService'
import { supabase } from '../src/lib/supabase'

async function fetchAndUpdatePandalData() {
  console.log('🔍 Fetching real pandal data from Google Maps...')
  
  try {
    // Check if Google Maps API key is available
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.log('⚠️  Google Maps API key not found.')
      console.log('💡 To use real-time Google Maps data:')
      console.log('1. Get API key from https://console.cloud.google.com/')
      console.log('2. Enable Places API and Google Maps JavaScript API')
      console.log('3. Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env.local')
      console.log('4. Run this script again')
      return
    }

    console.log('📍 Searching for famous Nagpur festival pandals...')
    const googleResults = await GooglePlacesService.searchFamousNagpurMandals()
    
    if (googleResults.length === 0) {
      console.log('❌ No mandals found on Google Maps')
      return
    }

    console.log(`✅ Found ${googleResults.length} mandals on Google Maps`)

    // Check if we can access the database
    const { data: existingData, error: checkError } = await supabase
      .from('pandals')
      .select('id')
      .limit(1)
    
    if (checkError) {
      console.log('⚠️  Cannot access Supabase database. Using Google data for display only.')
      console.log('🗺️  Found pandals from Google Maps:')
      
      googleResults.forEach((result, index) => {
        if (result.googleData) {
          console.log(`${index + 1}. ${result.googleData.name}`)
          console.log(`   📍 ${result.googleData.formatted_address}`)
          console.log(`   ⭐ Rating: ${result.googleData.rating || 'N/A'}`)
          console.log(`   📊 Reviews: ${result.googleData.user_ratings_total || 'N/A'}`)
          console.log('')
        }
      })
      return
    }

    // Update database with Google data
    let updatedCount = 0
    
    for (const result of googleResults) {
      if (!result.googleData) continue

      // Convert Google data to our format
      const pandalData = GooglePlacesService.convertToePandalLocation(
        result.googleData,
        {
          description: getDescriptionForMandal(result.googleData.name),
          timings: getTimingsForMandal(result.googleData.name),
          special_features: getFeaturesForMandal(result.googleData.name),
          contact: getContactForMandal(result.googleData.name)
        }
      )

      // Check if this pandal already exists
      const { data: existing } = await supabase
        .from('pandals')
        .select('id')
        .eq('name', pandalData.name)
        .single()

      if (existing) {
        // Update existing pandal
        const { error } = await supabase
          .from('pandals')
          .update({
            address: pandalData.address,
            latitude: pandalData.latitude,
            longitude: pandalData.longitude,
            rating: pandalData.rating,
            image_url: pandalData.image_url,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)

        if (!error) {
          console.log(`🔄 Updated: ${pandalData.name}`)
          updatedCount++
        }
      } else {
        // Insert new pandal
        const { error } = await supabase
          .from('pandals')
          .insert([{
            ...pandalData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])

        if (!error) {
          console.log(`➕ Added: ${pandalData.name}`)
          updatedCount++
        }
      }
    }

    console.log(`🎉 Successfully updated ${updatedCount} pandals with Google Maps data!`)
    console.log('📱 Your app now has real-time location data from Google Maps!')

  } catch (error) {
    console.error('❌ Error fetching Google data:', error)
    console.log('🔧 Troubleshooting:')
    console.log('1. Check your Google Maps API key')
    console.log('2. Ensure Places API is enabled')
    console.log('3. Check API quotas and billing')
  }
}

// Helper functions to provide additional context for known mandals
function getDescriptionForMandal(name: string): string {
  const descriptions: { [key: string]: string } = {
    'Tekdi Ganesh': "Nagpur's landmark hilltop Ganesh temple and a central Ganeshotsav darshan destination.",
    'Abhyankar Nagar': "One of Nagpur's grandest Durga Utsav pandals, known for royal-court scale themes.",
    'Laxmi Nagar': "Popular Durga Puja near Aath Rasta Chowk, famed for illumination and Kolkata-inspired themes.",
    'Ravi Nagar': "Large Durga Utsav ground setup, often featuring heritage fortress themes.",
    'Itwari': "Traditional commercial-hub pandal in Itwari, a major crowd-puller during Durga Utsav.",
    'Ambazari': "Community Durga Utsav near Ambazari Lake with a calmer, traditional atmosphere."
  }
  
  for (const [key, desc] of Object.entries(descriptions)) {
    if (name.includes(key)) return desc
  }
  
  return `Famous festival pandal in Nagpur with rich cultural heritage.`
}

function getTimingsForMandal(name: string): string {
  // Most mandals have similar timings during festival
  return "4:00 AM - 11:00 PM (Festival timings may vary)"
}

function getFeaturesForMandal(name: string): string[] {
  const baseFeatures = ["Google Maps Verified", "Historical Significance"]
  
  if (name.includes('Tekdi')) return [...baseFeatures, "Hilltop Darshan", "Nagpur Landmark"]
  if (name.includes('Abhyankar')) return [...baseFeatures, "Grand Theme", "Royal Court"]
  if (name.includes('Laxmi') || name.includes('Rasta')) return [...baseFeatures, "Illumination", "Themed Pandal"]
  if (name.includes('Ravi Nagar')) return [...baseFeatures, "Heritage Theme", "Ground Setup"]
  if (name.includes('Itwari')) return [...baseFeatures, "Old City", "Crowd Favourite"]
  if (name.includes('Ambazari') || name.includes('Ambajhari')) return [...baseFeatures, "Lakeside", "Traditional Rituals"]
  
  return baseFeatures
}

function getContactForMandal(name: string): string | undefined {
  // Return undefined to use Google's contact info if available
  return undefined
}

// Run the script
fetchAndUpdatePandalData()
