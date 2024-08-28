import { getNetworksByCountry } from "@/lib/get-networks-by-country"
import { getStationsForNetwork } from "@/lib/get-stations-for-network"
import { CityBikeTypes, Network } from "../../@types/city-bike-types"
import { getNetworks } from "@/lib/get-networks"
import { getStationDetails } from "@/lib/get-station-details"
import { Station } from "../../@types/city-bike-by-country-types"

export default async function Home() {
  const networks: CityBikeTypes = await getNetworks()
  const networksByCountry = await getNetworksByCountry()

  const networkHref = networks.networks[16]?.href!
  console.log("Network Href:", networkHref)

  const stations: Station[] = await getStationDetails(networkHref)
  console.log("Stations:", stations)

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>CityBike</h1>
      <div className="flex items-center space-x-1">
        <strong>Total de Redes:</strong>
        <span>
          {networks.networks.length > 0
            ? networks.networks.length
            : "No hay redes"}
        </span>
      </div>

      <div className="flex space-x-1">
        <strong>Total de Redes por país:</strong>
        <span>
          {Object.keys(networksByCountry).map((country) => (
            <div key={country}>
              {country}: {networksByCountry[country]}
            </div>
          ))}
        </span>
      </div>
      {/* Renderização dos detalhes das estações */}
      <div className="flex space-x-1">
        <strong>Detalhes das estações:</strong>
        <ul>
          {stations?.length > 0 ? (
            stations.map((station) => (
              <li key={station.id}>
                <div>
                  <strong>{station.name}</strong>
                </div>
                {/* <div>Capacidade: {station.capacity}</div> */}
                <div>
                  Localização: {station.latitude}, {station.longitude}
                </div>
              </li>
            ))
          ) : (
            <span>No station details available</span>
          )}
        </ul>
      </div>

      {/* <pre>{JSON.stringify(networks.networks[1], null, 2)}</pre> */}
    </main>
  )
}
