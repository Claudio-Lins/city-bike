"use client"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { useEffect, useState } from "react"
import { CityBikeTypes, Network } from "../../@types/city-bike-types"
import { Station } from "../../@types/city-bike-by-country-types"
import { useMap } from "react-leaflet"

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  {
    ssr: false,
  }
)

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  {
    ssr: false,
  }
)

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  {
    ssr: false,
  }
)

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
})
import "leaflet/dist/leaflet.css"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

const MapWrapper = ({
  center,
  zoom,
  children,
}: {
  center: [number, number]
  zoom: number
  children: React.ReactNode
}) => {
  const map = useMap()

  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])

  return <>{children}</>
}

interface MapProps {
  networks: CityBikeTypes
  numberOfNetworksPerCountry: { country: string; count: number }[]
  stationsDetails: Station[]
}

export function Map({}: MapProps) {
  const [networks, setNetworks] = useState<Network[]>([])

  useEffect(() => {
    // Usando fetch para fazer a requisição à API
    fetch("http://api.citybik.es/v2/networks")
      .then((response) => response.json())
      .then((data) => {
        setNetworks(data.networks)
      })
      .catch((error) => {
        console.error("Erro ao buscar dados da API", error)
      })
  }, [])

  const center: [number, number] = [51.505, -0.09]
  const zoom = 3

  return (
    <MapContainer style={{ height: "100vh", width: "100%" }}>
      <MapWrapper center={center} zoom={zoom}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {networks.map((network) => (
          <Marker
            key={network.id}
            position={[network.location.latitude, network.location.longitude]}
          >
            <Popup>
              <strong>{network.name}</strong>
              <br />
              {network.location.city}, {network.location.country}
            </Popup>
          </Marker>
        ))}
      </MapWrapper>
    </MapContainer>
  )
}
