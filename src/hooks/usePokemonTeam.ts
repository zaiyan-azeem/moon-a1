import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function usePokemonTeam(limit = 8) {
  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial team
  const fetchTeam = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get<{ results: { name: string }[] }>(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
      );
      setIds(res.data.results.map((r) => r.name.toLowerCase()));
    } catch (e: any) {
      setError(e.message || "Failed to load team");
      setIds([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Add a Pokémon if it exists and isn’t already in the list
  const addPokemon = (name: string) => {
    const lower = name.trim().toLowerCase();
    if (!lower) return;
    setIds((prev) => (prev.includes(lower) ? prev : [...prev, lower]));
  };

  // Remove a Pokémon by name
  const removePokemon = (name: string) => {
    const lower = name.trim().toLowerCase();
    setIds((prev) => prev.filter((id) => id !== lower));
  };

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  return {
    ids,
    loading,
    error,
    refetch: fetchTeam,
    addPokemon,
    removePokemon,
  };
}
