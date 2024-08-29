import { getNetworksByCountry } from "@/lib/get-networks-by-country"
import { CityBikeTypes, Network } from "../../@types/city-bike-types"
import { getNetworks } from "@/lib/get-networks"
import { getStationDetails } from "@/lib/get-station-details"
import { Station } from "../../@types/city-bike-by-country-types"
import { Map } from "@/components/map"
import { getStationsForNetwork } from "@/lib/get-stations-for-network"
import { getNumberOfStationsPerNetwork } from "@/lib/get-number-of-stations-per-network"

export default async function Home() {
  const networks: CityBikeTypes = await getNetworks()
  const networksByCountry = await getNetworksByCountry()

  const networkHref = networks.networks[10]?.href!
  console.log("Network Href:", networkHref)

  // LAYER 1
  const numberOfNetworksPerCountry = Object.keys(networksByCountry).map(
    (country) => ({
      country,
      count: networksByCountry[country],
    })
  )

  // LAYER 2
  const numberOfStationsPerNetwork = await getNumberOfStationsPerNetwork()

  // LAYER 3
  const stationsDetails: Station[] = await getStationDetails(networkHref)

  return (
    <main className="flex min-h-screen flex-col items-center w-full relative">
      {/* <div className=" flex justify-end items-center w-full">
        <div className="mt-4 w-full max-w-xs bg-white/50 backdrop-blur-sm flex justify-end items-center p-4 rounded-md shadow-sm flex-col gap-2">
          <h1 className="font-bold text-3xl">CityBike</h1>
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
        </div>
      </div> */}
      {/* <Map networks={networks} /> */}
      {/* 
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
     
      
      <div className="flex space-x-1">
        <strong>Detalhes das estações:</strong>
        <ul>
          {stations?.length > 0 ? (
            stations.map((station) => (
              <li key={station.id}>
                <div>
                  <strong>{station.name}</strong>
                </div>
                
                <div>
                  Localização: {station.latitude}, {station.longitude}
                </div>
              </li>
            ))
          ) : (
            <span>No station details available</span>
          )}
        </ul>
      </div> */}

      <pre>{JSON.stringify(stationsDetails, null, 2)}</pre>
      {}
    </main>
  )
}
