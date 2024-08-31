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
import { Station } from "../@types/city-bike-by-country-types"
import { CityBikeTypes, Network } from "@/@types/city-bike-types"
import { NetworksDataTypes } from "@/@types/networks-data-types"

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
  const [stationDetailsByNetwork, setStationDetailsByNetwork] = useState<{
    [network: string]: Station[]
  }>({})

  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v2/networks`
        )
        const data: NetworksDataTypes = await response.json()
        setNetworkData(data)

        // Buscar contagem de estações
        const stationCounts = await Promise.all(
          data.networks.map(async (network) => {
            const stationCount = await getNumberOfStationsPerNetwork(
              network.href
            )
            return { id: network.id, count: stationCount }
          })
        )

        const stationCountsByNetwork = stationCounts.reduce(
          (acc: { [key: string]: number }, item) => {
            acc[item.id] = item.count
            return acc
          },
          {}
        )

        setNumberOfStationsPerNetwork(stationCountsByNetwork)

        // Buscar detalhes das estações
        const stationsDetails = await Promise.all(
          data.networks.map(async (network) => {
            const stations = await getStationDetailsByNetwork(network.href)
            return { id: network.id, stations }
          })
        )

        const stationsDetailsByNetwork = stationsDetails.reduce(
          (acc: { [key: string]: Station[] }, item) => {
            acc[item.id] = item.stations
            return acc
          },
          {}
        )

        setStationDetailsByNetwork(stationsDetailsByNetwork)
      } catch (error) {
        console.error("Error fetching networks and station details:", error)
      }
    }

    fetchNetworkData()
  }, [])

  // Função para obter o número de estações em uma network
  const getNumberOfStationsPerNetwork = async (
    href: string
  ): Promise<number> => {
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

  // Função para obter os detalhes das estações de uma network
  const getStationDetailsByNetwork = async (
    href: string
  ): Promise<Station[]> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${href}?fields=stations`
      )

      if (!response.ok) {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        )
      }

      const { network } = await response.json()

      if (!network?.stations?.length) {
        throw new Error("No stations found in the network.")
      }

      return network.stations
    } catch (error: any) {
      console.error(`Error fetching station details: ${error.message}`)
      return []
    }
  }

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
              const countryLocation = network?.location
              return (
                <Marker
                  key={network.id}
                  position={[
                    countryLocation.latitude,
                    countryLocation.longitude,
                  ]}
                  icon={customIcon}
                >
                  <Popup>
                    <div>
                      <strong>Number of stations:</strong>{" "}
                      {numberOfStationsPerNetwork[network.id]}
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
              const stations = stationDetailsByNetwork[network.id]
              return stations?.map((station) => (
                <Marker
                  key={station.id}
                  position={[station.latitude, station.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    <div>
                      <strong>{station.name}</strong>
                      <p>Free bikes: {station.free_bikes}</p>
                      <p>Empty slots: {station.empty_slots}</p>
                      <p>
                        Last updated:{" "}
                        {new Date(station.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))
            })}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  )
}
