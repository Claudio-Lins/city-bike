import { cn } from "@/lib/utils"

interface HeaderProps {}

export function Header({}: HeaderProps) {
  return (
    <div
      className={cn(
        "w-full fixed h-20 bg-white/5 backdrop-blur-sm flex items-center justify-center z-50"
      )}
    >
      <h1 className="text-3xl font-bold -tracking-wide">CityBikes</h1>
    </div>
  )
}
