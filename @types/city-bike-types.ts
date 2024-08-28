export interface CityBikeTypes {
  networks: Network[]
}

export interface Network {
  id: string
  name: string
  location: Location
  href: string
  company: string[]
  gbfs_href?: string
  system?: string
  source?: string
  ebikes?: boolean
  license?: License
  scooters?: boolean
  instances?: Instance[]
}

export interface Instance {
  tag: string
  meta: Location
}

export interface Location {
  city: string
  country: string
  name?: string
  latitude: number
  longitude: number
}

export interface License {
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
