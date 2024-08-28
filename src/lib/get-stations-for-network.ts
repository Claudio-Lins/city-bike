import { Network } from "../../@types/city-bike-by-country-types"

export const getStationsForNetwork = async (
  networkHref: string
): Promise<number> => {
  try {
    const response = await fetch(networkHref)
    const data: Network = await response.json()

    return data.stations ? data.stations.length : 0
  } catch (error) {
    console.error("Error fetching station data:", error)
    throw new Error("Failed to fetch stations for network")
  }
}
