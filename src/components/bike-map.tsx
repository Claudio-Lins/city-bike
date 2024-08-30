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

interface BikeMapProps {
  networksData: NetworkTypes[]
  networksByCountry: {
    [country: string]: number
  }
  stationsDetails: Station[]
}

export function BikeMap({
  networksData,
  networksByCountry,
  stationsDetails,
}: BikeMapProps) {
  const [activeLayer, setActiveLayer] = useState("networksByCountry")
  // const [networks, setNetworks] = useState<NetworkTypes[]>([])

  // useEffect(() => {
  //   setNetworks(networksStaticData as NetworkTypes[])
  // }, [])
  // useEffect(() => {
  //   getNetworks().then((data) => {
  //     setNetworks(data.networks)
  //   })
  // }, [])

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

        {/* <LayersControl.Overlay
          name="Number of stations, per network"
          checked={activeLayer === "stationsPerNetwork"}
        >
          <LayerGroup
            eventHandlers={{
              add: () => setActiveLayer("stationsPerNetwork"),
            }}
          >
            {Object.keys(networksByCountry).map((country) => {
              const positionCountry = countryPosition(country)
              const networks = Object.keys(networksByCountry).filter(
                (network) => networksByCountry[network] > 0
              )
              const networksWithDetails = networks.filter((network) =>
                stationsDetails.some((station) => station?.id === network)
              )
              const totalStations = networksWithDetails.reduce(
                (acc, network) =>
                  acc + stationsDetails.filter((s) => s.id === network).length,
                0
              )
              return (
                <Marker key={country} position={positionCountry}>
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
        </LayersControl.Overlay> */}

        <LayersControl.Overlay
          name="Station details"
          checked={activeLayer === "stationDetails"}
        >
          <LayerGroup
            eventHandlers={{
              add: () => setActiveLayer("stationDetails"),
            }}
          >
            {networksData?.map((network, index) => {
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
                        {JSON.stringify(stationsDetails, null, 2)}
                        {/* <p>
                          ID: {stationsDetails[index]?.id},
                          <br />
                          Name: {stationsDetails[index]?.name},
                          <br />
                          Latitude: {stationsDetails[index]?.latitude},
                          <br />
                          Longitude: {stationsDetails[index]?.longitude}
                          <br />
                          <p>
                            Free bikes: {stationsDetails[index]?.free_bikes}
                          </p>
                        </p> */}
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
