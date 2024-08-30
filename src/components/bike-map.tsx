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
import { getNetworksByCountry } from "@/lib/get-networks-by-country"
import { getStationDetails } from "@/lib/get-station-details"
import { countryPosition } from "@/utils/countryPosition"
import { getStationsPosition } from "@/lib/get-stations-position"
import { Station } from "../@types/city-bike-by-country-types"

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
})

interface BikeMapProps {
  stationsPositions: [number, number][]
  networksByCountry: {
    [country: string]: number
  }
  stationsDetails: Station[]
  numberOfNetworksPerCountry: { country: string; count: number }[]
}

export function BikeMap({
  stationsPositions,
  networksByCountry,
  stationsDetails,
  numberOfNetworksPerCountry,
}: BikeMapProps) {
  const [activeLayer, setActiveLayer] = useState("networksByCountry")

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
            <Marker position={[20, 0]} icon={customIcon}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
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
            {stationsPositions.map(([lat, lng]: [number, number], index) => (
              <Marker key={index} position={[lat, lng]} icon={customIcon}>
                <Popup>
                  <div>
                    {/* <p>Name: {stationsDetails[index]?.name}</p> */}
                    <pre>
                      <strong>Station details:</strong>
                      <p>
                        ID: {stationsDetails[index]?.id},
                        <br />
                        Name: {stationsDetails[index]?.name},
                        <br />
                        Latitude: {stationsDetails[index]?.latitude},
                        <br />
                        Longitude: {stationsDetails[index]?.longitude}
                        <br />
                        <p>Free bikes: {stationsDetails[index]?.free_bikes}</p>
                      </p>
                    </pre>
                  </div>
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  )
}
