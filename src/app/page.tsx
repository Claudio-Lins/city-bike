"use client"

import dynamic from "next/dynamic"
import { getNetworks } from "@/lib/get-networks"
import { getNetworksByCountry } from "@/lib/get-networks-by-country"
import { getStationsPosition } from "@/lib/get-stations-position"
import { countStationsPerNetwork } from "@/lib/count-stations-per-network"
import { getStationDetails } from "@/lib/get-station-details"
import { networksStaticData } from "@/utils/networksStaticData"
import { Loader } from "lucide-react"
import { NetworksDataTypes, NetworkTypes } from "@/@types/networks-data-types"

const BikeMap = dynamic(
  () => import("@/components/bike-map").then((mod) => mod.BikeMap),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full relative">
      <BikeMap />
    </main>
  )
}
