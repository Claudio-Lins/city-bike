import { getCountriesFromNetworks } from "./get-countries-from-networks"
import { getCountryPosition } from "./get-country-position"

export const getCountryPositions = async (): Promise<{
  [key: string]: [number, number]
}> => {
  const countries = await getCountriesFromNetworks()

  const positions = countries.reduce((acc, country) => {
    acc[country] = getCountryPosition(country)
    return acc
  }, {} as { [key: string]: [number, number] })

  return positions
}
