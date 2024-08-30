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

// type DataType = {
//   networks: any
//   networksByCountry: any
//   stationsPositions: any
//   countStation: any
//   stationsDetails: any
//   numberOfNetworksPerCountry: any
// } | null

export default async function Home() {
  const networksData = await getNetworks()
  const networksByCountry = await getNetworksByCountry()
  const stationHref = await networksData?.networks.map(
    (network) => network.href
  )
  const stationsDetails = await getStationDetails(stationHref[0])
  // const [data, setData] = useState<DataType>(null)

  // useEffect(() => {
  //   async function fetchData() {
  //     const networks = await getNetworks()
  //     const networksByCountry = await getNetworksByCountry()
  //     const stationsPositions = await getStationsPosition("valenbisi")
  //     const networkHref = networks.networks[58]?.href
  //     const countStation = await countStationsPerNetwork(networkHref)
  //     const stationsDetails = await getStationDetails(networkHref)

  //     setData({
  //       networks,
  //       networksByCountry,
  //       stationsPositions,
  //       countStation,
  //       stationsDetails,
  //       numberOfNetworksPerCountry: networksByCountry.length,
  //     })
  //   }

  //   fetchData()
  // }, [])

  // if (!data)
  //   return (
  //     <div className="flex w-full h-dvh items-center justify-center">
  //       <Loader size="50" className=" animate-spin" />
  //     </div>
  //   )

  return (
    <main className="flex min-h-screen flex-col items-center w-full relative">
      <BikeMap
        networksData={networksData.networks}
        networksByCountry={networksByCountry}
        stationsDetails={stationsDetails}
      />
      <pre>
        {/* {JSON.stringify(networksData, null, 2)} */}
        {/* {JSON.stringify(data.stationsPositions, null, 2)} */}
        {/* {JSON.stringify(data.networksByCountry, null, 2)} */}
        {/* {JSON.stringify(data.stationsDetails, null, 2)} */}
        {/* {JSON.stringify(data.numberOfNetworksPerCountry, null, 2)} */}
      </pre>
    </main>
  )
}
