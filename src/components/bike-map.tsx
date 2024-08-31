"use client"

import { useEffect, useState } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  LayerGroup,
  useMapEvents,
  Tooltip,
  useMap,
} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { countryPosition } from "@/utils/countryPosition"
import {
  CityBikeNetwork,
  CityBikeApiResponse,
  CityBikeStation,
} from "@/@types/cityBikeTypes"

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
  const [stationsInNetwork, setStationsInNetwork] = useState<CityBikeStation[]>(
    []
  )

  const initialCenter: [number, number] = [20, 0] // Centro inicial do mapa
  const initialZoom = 2 // Zoom inicial do mapa

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

  const NetworkMarker = ({ network }: { network: CityBikeNetwork }) => {
    const map = useMap()

    const handleClick = async () => {
      const response = await fetch(
        `http://api.citybik.es/v2/networks/${network.id}`
      )
      const data = await response.json()

      setStationsInNetwork(data.network.stations)
      setActiveLayer("stationsInNetwork")

      // Ampliar o mapa e centralizar na posição da rede clicada no L2
      map.setView([network.location.latitude, network.location.longitude], 10) // Zoom ajustado para centralizar a rede
    }

    return (
      <Marker
        key={network.id}
        position={[network.location.latitude, network.location.longitude]}
        icon={customIcon}
        eventHandlers={{ click: handleClick }}
      >
        <Tooltip
          direction="top"
          offset={[0, -25]}
          opacity={1}
          permanent={false}
        >
          <div>
            <strong>{network.name}</strong>
            <p>Number of Stations: {network.stations?.length || 0}</p>
          </div>
        </Tooltip>
      </Marker>
    )
  }

  const CountryMarker = ({
    country,
    count,
  }: {
    country: string
    count: number
  }) => {
    const map = useMap()
    const position = countryPosition(country)

    const handleClick = () => {
      setSelectedCountry(country)
      setActiveLayer("networksInCountry")

      if (position) {
        map.setView(position, 5) // Ampliar e centralizar no país no L1
      }
    }

    return (
      <Marker
        key={country}
        position={position || [0, 0]}
        icon={customIcon}
        eventHandlers={{
          click: handleClick,
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
  }

  const MapEventsHandler = () => {
    const map = useMap()

    useMapEvents({
      click: () => {
        setSelectedCountry(null)
        setActiveLayer("networksByCountry")

        // Volta o zoom e a posição do mapa para os valores iniciais
        map.setView(initialCenter, initialZoom)
      },
    })
    return null
  }

  const StationMarker = ({ station }: { station: CityBikeStation }) => {
    const map = useMap()

    const handleClick = () => {
      map.setView([station.latitude, station.longitude], 13) // Ampliar menos e centralizar no L3
    }

    return (
      <Marker
        key={station.id}
        position={[station.latitude, station.longitude]}
        icon={customIcon}
        eventHandlers={{ click: handleClick }}
      >
        <Tooltip
          direction="top"
          offset={[0, -25]}
          opacity={1}
          permanent={false}
        >
          <div>
            <strong>{station.name}</strong>
            <p>Free Bikes: {station.free_bikes}</p>
            <p>Empty Slots: {station.empty_slots}</p>
          </div>
        </Tooltip>
      </Marker>
    )
  }

  return (
    <MapContainer
      center={initialCenter}
      zoom={initialZoom}
      style={{ height: "100vh", width: "100%", marginTop: -10 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEventsHandler />{" "}
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
            {Object.entries(networksByCountry).map(([country, count]) => (
              <CountryMarker key={country} country={country} count={count} />
            ))}
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
              {networksInCountry.map((network) => (
                <NetworkMarker key={network.id} network={network} />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        )}

        {stationsInNetwork.length > 0 && (
          <LayersControl.Overlay
            name="Stations in network"
            checked={activeLayer === "stationsInNetwork"}
          >
            <LayerGroup>
              {stationsInNetwork.map((station) => (
                <StationMarker key={station.id} station={station} />
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
        )}
      </LayersControl>
    </MapContainer>
  )
}
