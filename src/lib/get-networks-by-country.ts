import { CityBikeTypes, Network } from "../@types/city-bike-types"

export const getNetworksByCountry = async (): Promise<{
  [country: string]: number
}> => {
  try {
    const response = await fetch("http://api.citybik.es/v2/networks")
    const data: CityBikeTypes = await response.json()
    const networksByCountry = data.networks.reduce(
      (acc: { [country: string]: number }, network: Network) => {
        const country = network.location.country
        if (!acc[country]) {
          acc[country] = 0
        }
        acc[country] += 1
        return acc
      },
      {}
    )

    return networksByCountry
  } catch (error) {
    console.error("Error fetching networks by country:", error)
    throw new Error("Failed to fetch networks by country")
  }
}
