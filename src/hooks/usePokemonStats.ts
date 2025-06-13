import { useCallback, useEffect, useState } from "react"

export interface PokemonStat {
  name: string
  id: number
  sprite: string
  types: string[]
  hp: number
  attack: number
  defense: number
  speed: number
  xp: number
  height: number
  weight: number
}

interface UsePokemonStatsResult {
  data: PokemonStat[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function usePokemonStats(ids: string[]): UsePokemonStatsResult {
  const [data, setData] = useState<PokemonStat[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchIndex, setFetchIndex] = useState(0)

  const refetch = useCallback(() => {
    setFetchIndex((i) => i + 1)
  }, [])

  useEffect(() => {
    if (!ids || ids.length === 0) {
      setData([])
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    Promise.all(
      ids.map((id) =>
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
          .then((res) => {
            if (!res.ok) throw new Error(`Failed to fetch ${id}`)
            return res.json()
          })
          .then((poke) => ({
            name: poke.name,
            id: poke.id,
            sprite: poke.sprites?.front_default || "",
            types: Array.isArray(poke.types)
              ? poke.types.map((t: any) => t.type.name)
              : [],
            hp: poke.stats?.find((s: any) => s.stat.name === "hp")?.base_stat ?? 0,
            attack: poke.stats?.find((s: any) => s.stat.name === "attack")?.base_stat ?? 0,
            defense: poke.stats?.find((s: any) => s.stat.name === "defense")?.base_stat ?? 0,
            speed: poke.stats?.find((s: any) => s.stat.name === "speed")?.base_stat ?? 0,
            xp: poke.base_experience ?? 0,
            height: poke.height ?? 0,
            weight: poke.weight ?? 0,
          }))
      )
    )
      .then(setData)
      .catch((err) => setError(err.message || "Unknown error"))
      .finally(() => setLoading(false))
  }, [ids, fetchIndex])

  return { data, loading, error, refetch }
}

export function useGrowthRate(growthRateIdOrName: string) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchIndex, setFetchIndex] = useState(0)

  const refetch = useCallback(() => {
    setFetchIndex((i) => i + 1)
  }, [])

  useEffect(() => {
    if (!growthRateIdOrName) return
    setLoading(true)
    setError(null)
    fetch(`https://pokeapi.co/api/v2/growth-rate/${growthRateIdOrName}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch growth rate")
        return res.json()
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message || "Unknown error"))
      .finally(() => setLoading(false))
  }, [growthRateIdOrName, fetchIndex])

  return { data, loading, error, refetch }
}
