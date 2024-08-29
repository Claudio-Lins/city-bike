import { getNetworks } from "./get-networks"
import { getNumberOfStations } from "./get-number-of-stations"

export const getNumberOfStationsPerNetwork = async (): Promise<
  Record<string, number>
> => {
  try {
    const networks = await getNetworks()
    const networkData = networks.networks

    const stationCounts: Record<string, number> = {}

    const promises = networkData.map(async (network) => {
      try {
        const count = await getNumberOfStations(network.id)
        stationCounts[network.id] = count
      } catch (error) {
        console.error(
          `Error fetching stations for network ${network.id}:`,
          error
        )
        stationCounts[network.id] = 0
      }
    })

    await Promise.all(promises)

    return stationCounts
  } catch (error) {
    console.error("Error fetching number of stations per network:", error)
    throw new Error("Failed to fetch number of stations per network")
  }
}
