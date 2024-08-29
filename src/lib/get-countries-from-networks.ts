import { getNetworks } from "./get-networks"

export const getCountriesFromNetworks = async (): Promise<string[]> => {
  const { networks } = await getNetworks()

  const countries = networks.map((network) => network.location.country)
  const uniqueCountries = Array.from(new Set(countries))

  return uniqueCountries
}
