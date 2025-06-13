// src/App.tsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Sidebar } from "@/components/Sidebar";
import { SummaryCard } from "@/components/SummaryCard";
import { ChartCard } from "@/components/ChartCard";
import { DataTable } from "@/components/DataTable";
import { Spinner } from "@/components/Spinner";
import { exportCSV } from "@/utils/exportCSV";
import { usePokemonTeam } from "@/hooks/usePokemonTeam";
import { usePokemonStats } from "@/hooks/usePokemonStats";

export default function App() {
  const {
    ids,
    loading: teamLoading,
    error: teamError,
    refetch: refetchTeam,
    addPokemon,
    removePokemon,
  } = usePokemonTeam();
  const {
    data,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = usePokemonStats(ids);

  const [focus, setFocus] = useState<string>("");
  useEffect(() => {
    if (ids.length > 0) setFocus(ids[0]);
  }, [ids]);
  const focusData = data.find((p) => p.name === focus);

  // Utility to build day‐indexed series
  const makeSeries = <B extends Record<string, number>>(
    base: B,
    keys: (keyof B)[],
    fn: (k: keyof B, i: number) => number
  ): Array<{ day: number } & Record<keyof B, number>> =>
    Array.from({ length: 20 }, (_, i) => {
      const row: any = { day: i + 1 };
      keys.forEach((k) => (row[k] = fn(k, i)));
      return row;
    });

  // Stats evolution
  const multiLineData = useMemo(() => {
    if (!focusData) return [];
    const baseStats = {
      hp: focusData.hp,
      attack: focusData.attack,
      defense: focusData.defense,
      speed: focusData.speed,
    };
    return makeSeries(
      baseStats,
      ["hp", "attack", "defense", "speed"],
      (k, i) => baseStats[k] + i * (k === "hp" || k === "speed" ? 2 : 1)
    ).map((r) => ({
      day: r.day,
      HP: r.hp,
      Attack: r.attack,
      Defense: r.defense,
      Speed: r.speed,
    }));
  }, [focusData]);

  // XP growth
  const xpData = useMemo(() => {
    if (!focusData) return [];
    const baseXP = { xp: focusData.xp };
    return makeSeries(baseXP, ["xp"], (_, i) => baseXP.xp + i * 5).map((r) => ({
      day: r.day,
      experience: r.xp,
    }));
  }, [focusData]);

  // Summary metrics
  const teamHP = data.reduce((sum, p) => sum + p.hp, 0);
  const avgAttack = data.length
    ? Math.round(data.reduce((sum, p) => sum + p.attack, 0) / data.length)
    : 0;
  const teamSize = data.length;
  const totalXP = data.reduce((sum, p) => sum + p.xp, 0);

  // Extra charts
  const [extraCharts, setExtraCharts] = useState<
    Array<Parameters<typeof ChartCard>[0]>
  >([]);
  const removeChart = (idx: number) =>
    setExtraCharts((prev) => prev.filter((_, i) => i !== idx));

  // Add/remove Pokémon & charts (same as before)…
  const handleAddPokemon = async () => {
    const name =
      prompt("Enter Pokémon name or ID to add:")?.trim().toLowerCase();
    if (!name) return;
    if (!/^[a-z0-9-]+$/.test(name))
      return alert("Invalid identifier.");
    if (ids.includes(name))
      return alert(`${name} is already in your team.`);
    try {
      await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      addPokemon(name);
    } catch (e: any) {
      alert(
        e.response?.status === 404
          ? `Pokémon "${name}" not found.`
          : e.message
      );
    }
  };
  const handleAddChart = async () => {
    const name =
      prompt("Enter Pokémon name for extra charts:")?.trim().toLowerCase();
    if (!name) return;
    if (
      extraCharts.some((c) =>
        c.title.toLowerCase().includes(name)
      )
    )
      return alert(`${name} charts already exist.`);
    try {
      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${name}`
      );
      const p = res.data;
      const stats = {
        name: p.name,
        hp: p.stats.find((s: any) => s.stat.name === "hp").base_stat,
        attack: p.stats.find((s: any) => s.stat.name === "attack")
          .base_stat,
        defense: p.stats.find((s: any) => s.stat.name === "defense")
          .base_stat,
        speed: p.stats.find((s: any) => s.stat.name === "speed")
          .base_stat,
        xp: p.base_experience,
      };
      const pretty =
        stats.name[0].toUpperCase() + stats.name.slice(1);
      const evo = makeSeries(
        {
          hp: stats.hp,
          attack: stats.attack,
          defense: stats.defense,
          speed: stats.speed,
        },
        ["hp", "attack", "defense", "speed"],
        (k, i) =>
          stats[k] + (k === "hp" || k === "speed" ? i * 2 : i)
      ).map((r) => ({
        day: r.day,
        HP: r.hp,
        Attack: r.attack,
        Defense: r.defense,
        Speed: r.speed,
      }));
      const xpG = makeSeries({ xp: stats.xp }, ["xp"], (_, i) => stats.xp + i * 5).map(
        (r) => ({ day: r.day, experience: r.xp })
      );
      setExtraCharts((prev) => [
        ...prev,
        {
          title: `${pretty} Stats Evolution`,
          subtitle: "Stat progression by day",
          data: evo,
          xKey: "day",
          chartType: "multi-line",
          multiLineKeys: ["HP", "Attack", "Defense", "Speed"],
        },
        {
          title: `${pretty} Experience Growth`,
          subtitle: "XP gain per day",
          data: xpG,
          xKey: "day",
          yKey: "experience",
          chartType: "bar",
        },
      ]);
    } catch (e: any) {
      alert(
        e.response?.status === 404
          ? `Pokémon "${name}" not found.`
          : e.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hide sidebar on small screens */}
      
        <Sidebar />
     

      {/* main padding adjusts for mobile vs desktop */}
      <main className="pl-16 md:pl-64 p-4 md:p-8 md:pt-8 md:pr-12 max-w-[1600px] mx-auto">
        {/* Header actions */}
        <div className="flex flex-wrap items-center justify-between mb-8 gap-2">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            PokeTracker Dashboard
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleAddPokemon}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
            >
              + Add Pokémon
            </button>
            <button
              onClick={handleAddChart}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              + Add Chart
            </button>
            <button
              onClick={() => {
                refetchTeam();
                refetchStats();
              }}
              className="bg-zinc-200 dark:bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Loading & Errors */}
        {(teamLoading || statsLoading) && <Spinner />}
        {(teamError || statsError) && (
          <div className="text-red-500 mb-4">
            {teamError || statsError}
          </div>
        )}

        {/* Content */}
        {!teamLoading &&
          !statsLoading &&
          !teamError &&
          !statsError && (
            <>
              {/* Summary grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <SummaryCard
                  title="Team HP"
                  value={teamHP}
                  description={`+${data[0]?.hp || 0} total health points`}
                />
                <SummaryCard
                  title="Avg Attack"
                  value={avgAttack}
                  description="attack power"
                />
                <SummaryCard
                  title="Team Size"
                  value={teamSize}
                  description="pokemon in team"
                />
                <SummaryCard
                  title="Total XP"
                  value={totalXP.toLocaleString()}
                  description="experience points"
                />
              </div>

              {/* Focus selector */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-zinc-700 dark:text-zinc-200">
                  Focus Pokémon:
                </span>
                <select
                  className="border rounded px-2 py-1 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                >
                  {data.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name[0].toUpperCase() + p.name.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <ChartCard
                  title={
                    focusData
                      ? `${focusData.name[0].toUpperCase() +
                          focusData.name.slice(1)} Stats Evolution`
                      : ""
                  }
                  subtitle="Stat progression by day"
                  data={multiLineData}
                  xKey="day"
                  chartType="multi-line"
                  multiLineKeys={["HP", "Attack", "Defense", "Speed"]}
                />
                <ChartCard
                  title={
                    focusData
                      ? `${focusData.name[0].toUpperCase() +
                          focusData.name.slice(1)} Experience Growth`
                      : ""
                  }
                  subtitle="XP gain per day"
                  data={xpData}
                  xKey="day"
                  yKey="experience"
                  chartType="bar"
                />
              </div>

              {/* Extra Charts */}
              {extraCharts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  {extraCharts.map((cfg, idx) => (
                    <div key={idx} className="relative">
                      <button
                        onClick={() => removeChart(idx)}
                        className="absolute top-3 right-3 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                        aria-label="Remove chart"
                      >
                        ✕
                      </button>
                      <ChartCard {...cfg} />
                    </div>
                  ))}
                </div>
              )}

              {/* Table & Export */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  Pokémon Team
                </h2>
                <button
                  onClick={() => exportCSV(data, "pokemon-team.csv")}
                  className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/90"
                >
                  Export CSV
                </button>
              </div>

              {/* horizontal scroll on small */}
              <div className="overflow-x-auto">
                <DataTable data={data} onRemove={removePokemon} />
              </div>
            </>
          )}
      </main>
    </div>
  );
}
