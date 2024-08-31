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
import { getNetworks } from "@/lib/get-networks"
import { CityBikeTypes, Network } from "@/@types/city-bike-types"
import { networksStaticData } from "@/utils/networksStaticData"
import { NetworksDataTypes, NetworkTypes } from "@/@types/networks-data-types"

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getNetworksByCountry = async (): Promise<{
        [country: string]: number
      }> => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/v2/networks`
          )
          const data: CityBikeTypes = await response.json()
          const networksByCountry = data.networks.reduce(
            (acc: { [country: string]: number }, network: Network) => {
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
      getNetworksByCountry().then((data) => setNetworksByCountry(data))

      //
      const getNetworks = async (): Promise<NetworksDataTypes> => {
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
      getNetworks().then((data) => setNetworkData(data))

      //
    }
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
            {networkData?.networks?.map((network, index) => {
              const countryLocation = network?.location
              console.log("network: ", network)
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
                      <pre>
                        <strong>Number of stations, per network:</strong>
                        {/* {JSON.stringify(stationsDetails, null, 2)} */}
                      </pre>
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
            {networkData?.networks?.map((network, index) => {
              const countryLocation = network?.location
              console.log("network: ", network)
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
                      <pre>
                        <strong>Station details:</strong>
                        {/* {JSON.stringify(stationsDetails, null, 2)} */}
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
