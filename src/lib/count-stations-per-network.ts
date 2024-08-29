export async function countStationsPerNetwork(href: string): Promise<number> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${href}`)

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data: ${response.status} ${response.statusText}`
      )
    }

    const { network } = await response.json()

    if (!network?.stations?.length) {
      throw new Error("No stations found in the network.")
    }

    return network.stations.length
  } catch (error: any) {
    console.error(`Error counting stations: ${error.message}`)
    return 0
  }
}
