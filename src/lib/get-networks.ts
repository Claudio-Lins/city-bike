import { NetworksDataTypes, NetworkTypes } from "@/@types/networks-data-types"

export const getNetworks = async (): Promise<NetworksDataTypes> => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v2/networks`
    )

    if (!response.ok) {
      throw new Error("Failed to fetch networks")
    }

    const data: NetworksDataTypes = await response.json()

    return data
  } catch (error) {
    console.error("Error fetching data:", error)
    throw new Error("Failed to fetch networks")
  }
}
