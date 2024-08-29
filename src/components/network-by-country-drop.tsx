import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NetworkByCountryDropProps {
  totalStations: number
  networksByCountry: { [country: string]: number }
}

export function NetworkByCountryDrop({
  totalStations,
  networksByCountry,
}: NetworkByCountryDropProps) {
  return (
    <div className="w-full border rounded-md">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full border">
          Redes por país
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full max-w-none">
          <DropdownMenuLabel>{totalStations} Stations</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.keys(networksByCountry).map((country) => (
            <DropdownMenuItem className="text-xs" key={country}>
              {country}: {networksByCountry[country]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
