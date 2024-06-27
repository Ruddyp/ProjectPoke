'use client'

import { maxStats } from "@/lib/utils"

type PokemonStatBarProps = {
    statKey: StatsKey,
    value: number
}

const statKeyToText = {
    hp: "Point de vie",
    atk: "Attaque",
    def: "Défense",
    spe_atk: "Attaque spéciale",
    spe_def: "Défense spéciale",
    vit: "Vitesse",
}

type StatsKey = "hp" | "atk" | "def" | "spe_atk" | "spe_def" | "vit"

function getPercentageFromMaxStats(statKey: string, value: number) {
    const max = maxStats[statKey];
    return Math.round((value * 100) / max)
}

function getColor(percentage: number) {
    if (percentage >= 0 && percentage <= 20) {
        return "bg-red-600"
    }

    if (percentage > 20 && percentage <= 40) {
        return "bg-orange-500"
    }

    if (percentage > 40 && percentage <= 60) {
        return "bg-yellow-500"
    }

    if (percentage > 60 && percentage <= 80) {
        return "bg-lime-500"
    }

    if (percentage > 80 && percentage <= 100) {
        return "bg-green-700"
    }

    return "bg-cyan-500"
}

export default function PokemonStatBar({ statKey, value }: PokemonStatBarProps) {
    const percentage = getPercentageFromMaxStats(statKey, value);
    const color = getColor(percentage)

    return (
        <div className="flex flex-row gap-2 items-center justify-evenly">
            <p className="text-red-400 text-end w-[55%]">{statKeyToText[statKey]}</p>
            <div className="h-7 m-1 w-full outline outline-2 outline-slate-300 rounded-lg">
                <div className={`flex items-center justify-center h-7 ${color} rounded-lg`} style={{ width: `${percentage}%` }}>
                    <p className="font-bold text-white">{value}</p>
                </div>
            </div>
        </div>
    )
}