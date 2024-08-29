import { Station } from "../../@types/city-bike-by-country-types"

export const getStationsForNetwork = async (
  networkHref: string
): Promise<number> => {
  try {
    const response = await fetch(networkHref)

    if (!response.ok) {
      throw new Error(`Failed to fetch stations from ${networkHref}`)
    }

    const data: { stations: Station[] } = await response.json()

    return data.stations ? data.stations.length : 0
  } catch (error) {
    console.error("Error fetching station data:", error)
    return 0 // Retorna 0 se houver algum erro
  }
}
