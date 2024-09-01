"use client";

import { Header } from "@/components/header";
import dynamic from "next/dynamic";

const BikeMap = dynamic(
  () => import("@/components/bike-map").then((mod) => mod.BikeMap),
  { ssr: false },
);

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center">
      <Header />
      <div className="relative z-0 h-full w-full">
        <BikeMap />
      </div>
    </main>
  );
}
