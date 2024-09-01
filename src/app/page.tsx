"use client"

import { Header } from "@/components/header"
import dynamic from "next/dynamic"

const BikeMap = dynamic(
  () => import("@/components/bike-map").then((mod) => mod.BikeMap),
  { ssr: false }
)

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center w-full relative">
      <Header />
      <div className="w-full h-full relative z-0">
        <BikeMap />
      </div>
    </main>
  )
}
