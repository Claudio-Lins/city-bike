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
import { CityBikeNetwork, CityBikeApiResponse } from "@/@types/cityBikeTypes"

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
})

export function BikeMap() {
  const [activeLayer, setActiveLayer] = useState("networksByCountry")
  const [networksByCountry, setNetworksByCountry] = useState<
    Record<string, number>
  >({})

  useEffect(() => {
    async function fetchNetworks() {
      const response = await fetch("http://api.citybik.es/v2/networks")
      const data: CityBikeApiResponse = await response.json()

      const countryNetworkCount: Record<string, number> = data.networks.reduce(
        (acc, network) => {
          const country = network.location.country
          if (acc[country]) {
            acc[country] += 1
          } else {
            acc[country] = 1
          }
          return acc
        },
        {} as Record<string, number>
      )

      setNetworksByCountry(countryNetworkCount)
    }

    fetchNetworks()
  }, [])

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
            {Object.entries(networksByCountry).map(([country, count]) => {
              const position = countryPosition(country) || [0, 0] // Chama a função para obter a posição

              return (
                <Marker key={country} position={position} icon={customIcon}>
                  <Popup>
                    <div>
                      <strong>{country}</strong>
                      <p>Number of Networks: {count}</p>
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
