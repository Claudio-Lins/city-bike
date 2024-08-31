export interface NetworkDataTypes {
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
  uid: string
  number: string
  slots: number
  bike_uids: string[]
}
