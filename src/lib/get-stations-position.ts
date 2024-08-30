export async function getStationsPosition(networkId: string) {
  const url = `http://api.citybik.es/v2/networks/${networkId}`

  try {
    const response = await fetch(url)
    const data = await response.json()

    if (!data.network || !data.network.stations) {
      throw new Error("Dados das estações não encontrados.")
    }

    const positions = data.network.stations.map(
      (station: { latitude: number; longitude: number }) => {
        return [station.latitude, station.longitude]
      }
    )

    return positions
  } catch (error) {
    console.error("Erro ao buscar as posições das estações:", error)
    return []
  }
}
