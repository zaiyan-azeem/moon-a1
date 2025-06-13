# PokeTracker Dashboard

**PokeTracker** is a React & Vite-based dashboard for tracking your Pokémon team’s stats and performance in real time, using [PokeAPI](https://pokeapi.co/).

## 🚀 Features

- **Dynamic Team Roster**  
  Fetch your team via API, add new Pokémon by name.
- **Summary Cards**  
  Total Team HP, Average Attack, Team Size, and Total XP—auto-updates on changes.
- **Interactive Charts**  
  - **Stats Evolution** (HP, Attack, Defense, Speed) over 20 days  
  - **Experience Growth** over 20 days  
  - Add extra Pokémon charts on the fly, remove them individually.
- **Data Table**  
  Shows sprite, types, ID, HP, Attack, Defense, Speed, XP, height, weight.  
  Sortable columns, responsive design.
- **Export CSV**  
  Download your team’s data in CSV format with one click.
- **Dark Mode**  
  Toggle between light & dark themes.

## 📦 Tech Stack

- **Framework:** React (with Hooks)  
- **Bundler:** Vite  
- **UI Library:** [shadcn/ui](https://ui.shadcn.com) + Tailwind CSS  
- **Charts:** Recharts  
- **Data Fetching:** Axios  
- **Table:** @tanstack/react-table  
- **Icons:** lucide-react  
- **CSV Export:** file-saver

## 💻 Getting Started

### Prerequisites

- Node.js ≥ 16  
- npm or yarn

### Installation

```bash
git clone https://github.com/zaiyan-azeem/poketracker-dashboard.git
cd poketracker-dashboard
npm install
