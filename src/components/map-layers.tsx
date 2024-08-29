"use client"
import React, { useEffect, useState } from "react"
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
import { getNetworks } from "@/lib/get-networks"
import { Network } from "../../@types/city-bike-types"
import { getStationDetails } from "@/lib/get-station-details"
import { Station } from "../../@types/city-bike-by-country-types"

// Configure os ícones do Leaflet para funcionar corretamente com React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

export function MapLayers() {
  const [stationsByCountry, setStationsByCountry] = useState<{
    [country: string]: number
  }>({})
  const [networks, setNetworks] = useState<Network[]>([])
  const [stationsDetails, setStationsDetails] = useState<Station[]>([])

  useEffect(() => {
    // Fetch número de redes por país
    // getNetworksByCountry().then((data) => {
    //   setStationsByCountry(data)
    // })

    // Fetch número de estações por rede
    // getNetworks().then((data) => {
    //   setNetworks(data.networks)
    // })

    // Fetch detalhes das estações
    const fetchStationDetails = async () => {
      const details = await Promise.all(
        networks.map(async (network) => {
          const stations = await getStationDetails(
            `http://api.citybik.es${network.href}`
          )
          return stations
        })
      )
      setStationsDetails(details.flat())
    }

    if (networks.length) {
      fetchStationDetails()
    }
  }, [networks, networks.length])

  const center: [number, number] = [51.505, -0.09]
  const zoom = 3

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "100vh", width: "100%" }}
    >
      <LayersControl position="topright">
        {/* Layer 1: numberOfNetworksPerCountry */}
        <LayersControl.Overlay name="Number of Networks Per Country">
          <LayerGroup>
            {Object.entries(stationsByCountry).map(([country, count]) => (
              <Marker
                key={country}
                position={[
                  /* Replace with actual latitude and longitude for each country */
                  0, // Replace with latitude
                  0, // Replace with longitude
                ]}
              >
                <Popup>
                  <strong>{country}</strong>
                  <br />
                  {`Number of Networks: ${count}`}
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </LayersControl.Overlay>

        {/* Layer 2: numberOfStationsPerNetwork */}
        <LayersControl.Overlay name="Number of Stations Per Network">
          <LayerGroup>
            {networks.map((network) => (
              <Marker
                key={network.id}
                position={[
                  network.location.latitude,
                  network.location.longitude,
                ]}
              >
                <Popup>
                  <strong>{network.name}</strong>
                  <br />
                  {network.location.city}, {network.location.country}
                  <br />
                  {`Number of Stations: ${network.stationsCount}`}
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </LayersControl.Overlay>

        {/* Layer 3: stationsDetails */}
        <LayersControl.Overlay name="Station Details">
          <LayerGroup>
            {stationsDetails.map((station) => (
              <Marker
                key={station.id}
                position={[station.latitude, station.longitude]}
              >
                <Popup>
                  <strong>{station.name}</strong>
                  <br />
                  {`Free Bikes: ${station.free_bikes}`}
                  <br />
                  {`Empty Slots: ${station.empty_slots}`}
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>

      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    </MapContainer>
  )
}
