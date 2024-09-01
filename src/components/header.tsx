"use client";
import { cn } from "@/lib/utils";
import { useBikeStore } from "@/utils/city-bike-store";

interface HeaderProps {}

export function Header({}: HeaderProps) {
  const { totalNetworks, totalCountries } = useBikeStore();
  return (
    <div
      className={cn(
        "fixed z-50 flex h-24 w-full items-center justify-center bg-white/30 px-20 py-10 backdrop-blur-sm",
      )}
    >
      <div className="flex-1">
        <h1 className="text-4xl font-bold tracking-wide">CityBikes</h1>
      </div>

      <div className="ml-auto flex flex-col">
        <p className="text-xs font-semibold">Total Networks: {totalNetworks}</p>
        <p className="text-xs font-semibold">
          Total Countries: {totalCountries}
        </p>
      </div>
    </div>
  );
}
