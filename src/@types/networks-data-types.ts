export interface NetworksDataTypes {
  networks: NetworkTypes[]
}

export interface NetworkTypes {
  id: string
  name: string
  location: LocationTypes
  href: string
  stations: Station[]
  company: string[]
  gbfs_href?: string
  system?: string
  source?: string
  ebikes?: boolean
  license?: LicenseTypes
  scooters?: boolean
  instances?: InstanceTypes[]
}

export interface Station {
  id: string
  name: string
  latitude: number
  longitude: number
  timestamp: Date
  free_bikes: number
  empty_slots: number
}

export interface InstanceTypes {
  tag: string
  meta: LocationTypes
}

export interface LocationTypes {
  city: string
  country: string
  name?: string
  latitude: number
  longitude: number
}

export interface LicenseTypes {
  name: Name
  url: string
}

export enum Name {
  CreativeCommonsAttribution40InternationalCCBY40 = "Creative Commons Attribution 4.0 International (CC BY 4.0)",
  LicenceOuverte = "Licence Ouverte",
  OpenDataCommonsOpenDatabaseLicenseODBL = "Open Data Commons Open Database License (ODbL)",
  OpenLicence = "Open Licence",
  OpenLicence20 = "OPEN LICENCE 2.0",
  OpenUse = "Open Use",
}
