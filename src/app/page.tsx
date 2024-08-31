"use client"

import dynamic from "next/dynamic"

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
