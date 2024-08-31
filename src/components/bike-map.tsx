"use client"

import { useEffect, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { countryPosition } from "@/utils/countryPosition"
import { NetworksDataTypes, NetworkTypes } from "@/@types/networks-data-types"
import { fetchDataWithCache } from "@/utils/fetchDataWithCache"

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
})

export function BikeMap() {
  const [activeLayer, setActiveLayer] = useState("networksByCountry")
  const [networksByCountry, setNetworksByCountry] = useState<{
    [country: string]: number
  }>({})
  const [networkData, setNetworkData] = useState<NetworksDataTypes>()
  const [numberOfStationsPerNetwork, setNumberOfStationsPerNetwork] = useState<{
    [network: string]: number
  }>({})

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        // Usar fetchDataWithCache para obter dados com cache
        const data = await fetchDataWithCache<NetworksDataTypes>(
          `${process.env.NEXT_PUBLIC_API_URL}/v2/networks`,
          "networksData",
          5 * 60 * 1000
        )
        setNetworkData(data)

        const stationCounts = await Promise.all(
          data.networks.map(async (network: NetworkTypes) => {
            const stationCount = await getNumberOfStationsPerNetwork(
              network.href
            )
            return { id: network.id, count: stationCount }
          })
        )

        const stationCountsByNetwork = stationCounts.reduce(
          (
            acc: { [key: string]: number },
            item: { id: string; count: number }
          ) => {
            acc[item.id] = item.count
            return acc
          },
          {}
        )

        setNumberOfStationsPerNetwork(stationCountsByNetwork)
      } catch (error) {
        console.error("Error fetching networks and station counts:", error)
      }
    }

    const getNumberOfStationsPerNetwork = async (
      href: string
    ): Promise<number> => {
      try {
        // Usar fetchDataWithCache para obter dados com cache
        const response = await fetchDataWithCache<{
          network: { stations: any[] }
        }>(
          `${process.env.NEXT_PUBLIC_API_URL}${href}?fields=stations`,
          `stationsData_${href}`,
          5 * 60 * 1000 // Cache por 5 minutos
        )

        if (!response.network?.stations?.length) {
          throw new Error("No stations found in the network.")
        }

        return response.network.stations.length
      } catch (error: any) {
        console.error(`Error counting stations: ${error.message}`)
        return 0
      }
    }

    const getNetworksByCountry = async (): Promise<{
      [country: string]: number
    }> => {
      try {
        // Usar fetchDataWithCache para obter dados com cache
        const data = await fetchDataWithCache<NetworksDataTypes>(
          `${process.env.NEXT_PUBLIC_API_URL}/v2/networks`,
          "networksByCountryData",
          5 * 60 * 1000 // Cache por 5 minutos
        )

        const networksByCountry = data.networks.reduce(
          (acc: { [country: string]: number }, network: NetworkTypes) => {
            const country = network.location.country
            if (!acc[country]) {
              acc[country] = 0
            }
            acc[country] += 1
            return acc
          },
          {}
        )

        return networksByCountry
      } catch (error) {
        console.error("Error fetching networks by country:", error)
        throw new Error("Failed to fetch networks by country")
      }
    }

    fetchNetworkData()
    getNetworksByCountry().then((data) => setNetworksByCountry(data))
  }, [])

  console.log("networkData", networkData)

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100%", marginTop: -10 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LayersControl position="topright">
        <LayersControl.Overlay
          name="Number of networks, per country"
          checked={activeLayer === "networksByCountry"}
        >
          <LayerGroup
            eventHandlers={{
              add: () => setActiveLayer("networksByCountry"),
            }}
          >
            {Object.keys(networksByCountry).map((country) => {
              const position = countryPosition(country)
              return (
                <Marker key={country} position={position} icon={customIcon}>
                  <Popup>
                    <div>
                      <strong>{country}</strong>
                      <p>Networks: {networksByCountry[country]}</p>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </LayerGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay
          name="Number of stations, per network"
          checked={activeLayer === "stationsPerNetwork"}
        >
          <LayerGroup
            eventHandlers={{
              add: () => setActiveLayer("stationsPerNetwork"),
            }}
          >
            {networkData?.networks?.map((network) => {
              const location = network.location
              return (
                <Marker
                  key={network.id}
                  position={[location.latitude, location.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <div>
                      <strong>{network.name}</strong>
                      <p>Stations: {numberOfStationsPerNetwork[network.id]}</p>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </LayerGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay
          name="Station details"
          checked={activeLayer === "stationDetails"}
        >
          <LayerGroup
            eventHandlers={{
              add: () => setActiveLayer("stationDetails"),
            }}
          >
            {networkData?.networks?.map((network) => {
              const location = network.location
              return (
                <Marker
                  key={network.id}
                  position={[location.latitude, location.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <div>
                      <pre>
                        <strong>Station details:</strong>
                        <br />
                        {JSON.stringify(network, null, 2)}
                        <br />
                      </pre>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  )
}
