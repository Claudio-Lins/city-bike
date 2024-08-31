export interface CityBikeLocation {
  latitude: number
  longitude: number
  city: string
  country: string
}

export interface CityBikeStationExtra {
  uid: string
  number: string
  slots: number
  bike_uids: string[]
}

export interface CityBikeStation {
  id: string
  name: string
  latitude: number
  longitude: number
  timestamp: string // Consider using Date instead if you plan to parse this
  free_bikes: number
  empty_slots: number
  extra: CityBikeStationExtra
}

export interface CityBikeNetwork {
  id: string
  name: string
  location: CityBikeLocation
  href: string
  company: string[]
  system?: string // Optional, as not all networks may have this field
  stations?: CityBikeStation[] // Optional, as stations are typically loaded in a second request
}

export interface CityBikeApiResponse {
  networks: CityBikeNetwork[]
}

export interface CityBikeNetworkDetails {
  network: CityBikeNetwork
}
