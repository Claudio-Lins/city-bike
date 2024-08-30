import { Station } from "../@types/city-bike-by-country-types"

export const getStationDetails = async (
  stationHref: string
): Promise<Station[]> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${stationHref}`
    )
    const data: { network: { stations: Station[] } } = await response.json()

    return data.network.stations
  } catch (error) {
    console.error("Error fetching station details:", error)
    throw new Error("Failed to fetch station details")
  }
}
