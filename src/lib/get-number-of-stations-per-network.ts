import { getNetworks } from "./get-networks"
import { getNumberOfStations } from "./get-number-of-stations"

export const getNumberOfStationsPerNetwork = async (): Promise<
  Record<string, number>
> => {
  try {
    const networks = await getNetworks()
    const networkData = networks.networks

    const stationCounts: Record<string, number> = {}

    for (const network of networkData) {
      const count = await getNumberOfStations(network.id)
      stationCounts[network.id] = count
    }

    return stationCounts
  } catch (error) {
    console.error("Error fetching number of stations per network:", error)
    throw new Error("Failed to fetch number of stations per network")
  }
}
