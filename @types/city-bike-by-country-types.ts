export interface CityBikeByCountryTypes {
  network: Network
}

export interface Network {
  id: string
  name: string
  location: Location
  href: string
  company: string[]
  system: string
  stations: Station[]
  stationsCount: number
}

export interface Location {
  latitude: number
  longitude: number
  city: string
  country: string
}

export interface Station {
  id: string
  name: string
  latitude: number
  longitude: number
  timestamp: Date
  free_bikes: number
  empty_slots: number
  extra: Extra
}

export interface Extra {
  uid: number
  normal_bikes: number
  ebikes: number
  slots: number
  online: boolean
}
