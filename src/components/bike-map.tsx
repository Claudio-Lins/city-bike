"use client"

import { useEffect, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
  useMapEvents,
  Tooltip,
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
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [networksInCountry, setNetworksInCountry] = useState<CityBikeNetwork[]>(
    []
  )

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

  useEffect(() => {
    const fetchNetworksInCountry = async () => {
      const response = await fetch("http://api.citybik.es/v2/networks")
      const data: CityBikeApiResponse = await response.json()

      const networks = data.networks.filter(
        (network) => network.location.country === selectedCountry
      )
      setNetworksInCountry(networks)
    }

    if (selectedCountry) {
      fetchNetworksInCountry()
    }
  }, [selectedCountry])

  const handleCountryClick = (country: string) => {
    setSelectedCountry(country)
    setActiveLayer("networksInCountry")
  }

  // Pink: Função para voltar ao L1 quando clicar fora dos markers
  const MapEventsHandler = () => {
    useMapEvents({
      click: () => {
        setSelectedCountry(null)
        setActiveLayer("networksByCountry")
      },
    })
    return null
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
      <MapEventsHandler />{" "}
      {/* Pink: Adiciona o manipulador de eventos no mapa */}
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
              const position: [number, number] = countryPosition(country) || [
                0, 0,
              ]

              return (
                <Marker
                  key={country}
                  position={position}
                  icon={customIcon}
                  eventHandlers={{
                    click: () => handleCountryClick(country),
                  }}
                >
                  <Tooltip
                    direction="top"
                    offset={[0, -25]}
                    opacity={1}
                    permanent={false}
                  >
                    <div>
                      <strong>{country}</strong>
                      <p>Number of Networks: {count}</p>
                    </div>
                  </Tooltip>
                </Marker>
              )
            })}
          </LayerGroup>
        </LayersControl.Overlay>

        {selectedCountry && (
          <LayersControl.Overlay
            name={`Networks in ${selectedCountry}`}
            checked={activeLayer === "networksInCountry"}
          >
            <LayerGroup
              eventHandlers={{
                add: () => setActiveLayer("networksInCountry"),
              }}
            >
              {networksInCountry.map((network) => {
                const position: [number, number] = [
                  network.location.latitude,
                  network.location.longitude,
                ]

                return (
                  <Marker
                    key={network.id}
                    position={position}
                    icon={customIcon}
                  >
                    <Tooltip>
                      <div>
                        <strong>{network.name}</strong>
                        <p>
                          Number of Stations: {network.stations?.length || 0}
                        </p>
                      </div>
                    </Tooltip>
                  </Marker>
                )
              })}
            </LayerGroup>
          </LayersControl.Overlay>
        )}
      </LayersControl>
    </MapContainer>
  )
}
