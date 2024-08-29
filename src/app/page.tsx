import { getNetworksByCountry } from "@/lib/get-networks-by-country"
import { CityBikeTypes } from "../../@types/city-bike-types"
import { getNetworks } from "@/lib/get-networks"
import { getStationDetails } from "@/lib/get-station-details"
import { Station } from "../../@types/city-bike-by-country-types"
import { Map } from "@/components/map"
import { MapLayers } from "@/components/map-layers"
import { countStationsPerNetwork } from "@/lib/count-stations-per-network"

export default async function Home() {
  const networks: CityBikeTypes = await getNetworks()
  const networksByCountry = await getNetworksByCountry()

  const networkHref = networks.networks[1]?.href

  // LAYER 1
  const numberOfNetworksPerCountry = Object.keys(networksByCountry).map(
    (country) => ({
      country,
      count: networksByCountry[country],
    })
  )

  // LAYER 2
  const countStation = await countStationsPerNetwork(networkHref)

  // LAYER 3
  const stationsDetails: Station[] = await getStationDetails(networkHref)

  return (
    <main className="flex min-h-screen flex-col items-center w-full">
      {/* <pre>{JSON.stringify(numberOfNetworksPerCountry, null, 2)}</pre> */}
      <pre>{JSON.stringify(countStation, null, 2)}</pre>
      {/* <pre>{JSON.stringify(stationsDetails, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(networks, null, 2)}</pre> */}
      {/* <Map networks={networks} /> */}
    </main>
  )
}
