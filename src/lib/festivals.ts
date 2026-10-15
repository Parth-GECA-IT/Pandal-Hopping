export const FESTIVALS = [
  { id: 1, name: 'Ganeshotsav', shortName: 'Ganeshotsav' },
  { id: 2, name: 'Durga Utsav', shortName: 'Durga Utsav' },
] as const

export type FestivalId = (typeof FESTIVALS)[number]['id']