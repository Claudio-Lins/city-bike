import { getNetworksByCountry } from "@/lib/get-networks-by-country"
import { CityBikeTypes } from "../../@types/city-bike-types"
import { getNetworks } from "@/lib/get-networks"
import { getStationDetails } from "@/lib/get-station-details"
import { Station } from "../../@types/city-bike-by-country-types"
// import { Map } from "@/components/map"
import { getNumberOfStationsPerNetwork } from "@/lib/get-number-of-stations-per-network"
import { MapLayers } from "@/components/map-layers"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/components/map").then((mod) => mod.Map), {
  ssr: false,
})

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
  // const numberOfStationsPerNetwork = await getNumberOfStationsPerNetwork()

  // LAYER 3
  const stationsDetails: Station[] = await getStationDetails(networkHref)

  return (
    <main className="flex min-h-screen flex-col items-center w-full">
      {/* <pre>{JSON.stringify(numberOfNetworksPerCountry, null, 2)}</pre> */}
      <Map
        networks={networks}
        stationsDetails={stationsDetails}
        numberOfNetworksPerCountry={numberOfNetworksPerCountry}
      />
    </main>
  )
}
