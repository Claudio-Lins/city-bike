export const getNumberOfStations = async (
  networkId: string
): Promise<number> => {
  try {
    const response = await fetch(
      `http://api.citybik.es/v2/networks/${networkId}`
    )
    if (!response.ok) {
      throw new Error(`Failed to fetch details for network ${networkId}`)
    }
    const data = await response.json()

    const numberOfStations = data.network.stations
      ? data.network.stations.length
      : 0
    return numberOfStations
  } catch (error) {
    console.error(`Error fetching stations for network ${networkId}:`, error)
    return 0
  }
}
