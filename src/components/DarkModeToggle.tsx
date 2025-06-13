import React from "react"
import { Switch } from "./ui/switch"
import { Sun, Moon } from "lucide-react"

export function DarkModeToggle() {
  const [enabled, setEnabled] = React.useState(() =>
    typeof window !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  )

  React.useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [enabled])

  return (
    <div className="flex items-center gap-2">
      <Sun className="size-5 text-yellow-400" />
      <Switch
        checked={enabled}
        onCheckedChange={setEnabled}
        aria-label="Toggle dark mode"
        className="mx-2"
      />
      <Moon className="size-5 text-blue-500" />
    </div>
  )
}
