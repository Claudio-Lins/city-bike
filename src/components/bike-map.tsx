"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { getNetworksByCountry } from "@/lib/get-networks-by-country"

import "leaflet/dist/leaflet.css"
import { getCountryPosition } from "@/lib/get-country-position"
import { countryPosition } from "@/utils/countryPosition"

// Definir um ícone personalizado para os marcadores (opcional)
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
  // shadowUrl:
  //   "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  // shadowSize: [50, 64],
  // shadowAnchor: [4, 62],
})

export function BikeMap() {
  const [networksByCountry, setNetworksByCountry] = useState<{
    [country: string]: number
  }>({})

  useEffect(() => {
    async function fetchData() {
      const data = await getNetworksByCountry()
      setNetworksByCountry(data)
    }

    fetchData()
  }, [])

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
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
    </MapContainer>
  )
}
