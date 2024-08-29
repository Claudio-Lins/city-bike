import { Station } from "../../@types/city-bike-by-country-types"

export const getStationDetails = async (
  stationHref: string
): Promise<Station[]> => {
  try {
    const baseUrl = "http://api.citybik.es"
    const response = await fetch(`${baseUrl}${stationHref}`)
    const data: { network: { stations: Station[] } } = await response.json()

    return data.network.stations
  } catch (error) {
    console.error("Error fetching station details:", error)
    throw new Error("Failed to fetch station details")
  }
}
