"use client"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { getNetworks } from "@/lib/get-networks"
import { getNetworksByCountry } from "@/lib/get-networks-by-country"
import { getStationsPosition } from "@/lib/get-stations-position"
import { countStationsPerNetwork } from "@/lib/count-stations-per-network"
import { getStationDetails } from "@/lib/get-station-details"
import { Network } from "@/@types/city-bike-types"

const BikeMap = dynamic(
  () => import("@/components/bike-map").then((mod) => mod.BikeMap),
  { ssr: false }
)

type DataType = {
  networks: any
  networksByCountry: any
  stationsPositions: any
  countStation: any
  stationsDetails: any
  numberOfNetworksPerCountry: any
} | null

export default function Home() {
  const [data, setData] = useState<DataType>(null)

  useEffect(() => {
    async function fetchData() {
      const networks = await getNetworks()
      const networksByCountry = await getNetworksByCountry()
      const stationsPositions = await getStationsPosition("velib")
      const networkHref = networks.networks[58]?.href
      const countStation = await countStationsPerNetwork(networkHref)
      const stationsDetails = await getStationDetails(networkHref)

      setData({
        networks,
        networksByCountry,
        stationsPositions,
        countStation,
        stationsDetails,
        numberOfNetworksPerCountry: networksByCountry.length,
      })
    }

    fetchData()
  }, [])

  if (!data) return <p>Loading...</p>

  return (
    <main className="flex min-h-screen flex-col items-center w-full relative">
      <BikeMap
        stationsPositions={data.stationsPositions}
        networksByCountry={data.networksByCountry}
        stationsDetails={data.stationsDetails}
        numberOfNetworksPerCountry={data.numberOfNetworksPerCountry}
      />
    </main>
  )
}
