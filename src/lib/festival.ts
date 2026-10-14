export type FestivalType = 'ganeshotsav' | 'durga-utsav'

export const NAGPUR_CENTER = {
  latitude: 21.1458,
  longitude: 79.0882,
} as const

export const NAGPUR_AREAS = [
  { name: 'Sitabuldi', latitude: 21.1498, longitude: 79.0822 },
  { name: 'Dharampeth', latitude: 21.1406, longitude: 79.0615 },
  { name: 'Mahal', latitude: 21.1462, longitude: 79.1090 },
  { name: 'Sadar', latitude: 21.1610, longitude: 79.0805 },
  { name: 'Itwari', latitude: 21.1518, longitude: 79.1088 },
  { name: 'Laxmi Nagar', latitude: 21.1226, longitude: 79.0639 },
  { name: 'Ambazari', latitude: 21.1341, longitude: 79.0446 },
  { name: 'Khamla', latitude: 21.1092, longitude: 79.0574 },
] as const

export const FESTIVAL_STORAGE_KEY = 'nagpur-pandal-festival'

export interface FestivalTheme {
  id: FestivalType
  name: string
  shortName: string
  city: string
  deity: string
  greeting: string
  appName: string
  tagline: string
  banner: string
  mapLoading: string
  locationHint: string
  footerBlurb: string
  headerGradient: string
  pageGradient: string
  accentText: string
  accentButton: string
  markerAlt: string
  festivalStart: Date
  festivalEnd: Date
}

export const FESTIVALS: Record<FestivalType, FestivalTheme> = {
  ganeshotsav: {
    id: 'ganeshotsav',
    name: 'Ganeshotsav',
    shortName: 'Ganeshotsav',
    city: 'Nagpur',
    deity: 'Ganpati Bappa',
    greeting: 'Ganpati Bappa Morya!',
    appName: 'Nagpur Pandal Navigator',
    tagline: 'Find Ganeshotsav pandals across Nagpur',
    banner: 'Ganeshotsav in Nagpur — plan darshan, routes, and crowd-smart visits',
    mapLoading: 'Loading Ganeshotsav pandals in Nagpur...',
    locationHint: 'Find Ganeshotsav pandals near you in Nagpur',
    footerBlurb:
      'Ganeshotsav across Sitabuldi, Mahal, Dharampeth, Sadar, and Itwari. Tap a marker for timings, crowd status, and directions.',
    headerGradient: 'from-orange-600 via-red-500 to-pink-600',
    pageGradient: 'from-orange-50 via-yellow-50 to-red-50',
    accentText: 'text-orange-700',
    accentButton: 'from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700',
    markerAlt: 'Ganeshotsav pandal',
    festivalStart: new Date('2026-09-14'),
    festivalEnd: new Date('2026-09-23'),
  },
  'durga-utsav': {
    id: 'durga-utsav',
    name: 'Durga Utsav',
    shortName: 'Durga Utsav',
    city: 'Nagpur',
    deity: 'Maa Durga',
    greeting: 'Jai Maa Durga!',
    appName: 'Nagpur Pandal Navigator',
    tagline: 'Find Durga Utsav pandals across Nagpur',
    banner: 'Durga Utsav in Nagpur — themed pandals, aarti timings, and smart routes',
    mapLoading: 'Loading Durga Utsav pandals in Nagpur...',
    locationHint: 'Find Durga Utsav pandals near you in Nagpur',
    footerBlurb:
      'Durga Utsav across Abhyankar Nagar, Laxmi Nagar, Ravi Nagar, Itwari, Ambazari, and Khamla. Tap a marker for themes, crowd, and directions.',
    headerGradient: 'from-rose-800 via-red-700 to-amber-600',
    pageGradient: 'from-rose-50 via-orange-50 to-amber-50',
    accentText: 'text-rose-800',
    accentButton: 'from-rose-700 to-red-700 hover:from-rose-800 hover:to-red-800',
    markerAlt: 'Durga Utsav pandal',
    festivalStart: new Date('2026-10-11'),
    festivalEnd: new Date('2026-10-20'),
  },
}

export function isFestivalType(value: string | null | undefined): value is FestivalType {
  return value === 'ganeshotsav' || value === 'durga-utsav'
}

export function inferFestival(name: string, description = ''): FestivalType {
  const haystack = `${name} ${description}`.toLowerCase()
  if (
    /durga|navratri|maa durga|maa kali|sandhi puja|durgotsav|durga-utsav|durga utsav/.test(
      haystack
    )
  ) {
    return 'durga-utsav'
  }
  return 'ganeshotsav'
}
