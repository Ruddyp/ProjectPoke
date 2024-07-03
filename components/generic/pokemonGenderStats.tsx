'use client'

import { PokemonSexe } from "@/app/type"


type PokemonGenderStatsProps = {
    sexe: PokemonSexe | null;
}

export default function PokemonGenderStats({ sexe }: PokemonGenderStatsProps) {

    if (sexe == null) {
        return <p>Répartition inconnue</p>
    }

    if (sexe.male === 100) {
        return (
            <div className="relative flex flex-row justify-center w-full h-8">
                <div className="bg-[#5bc0de] rounded-lg border-2 border-slate-300" style={{ width: `${sexe.male}%` }}></div>
                <span className="absolute self-center text-accent font-medium">{sexe.male}%</span>
            </div>
        )
    }

    if (sexe.female === 100) {
        return (
            <div className="relative flex flex-row justify-center w-full h-8">
                <div className="bg-[#ffc0cb] rounded-lg border-2 border-slate-300" style={{ width: `${sexe.female}%` }}></div>
                <span className="absolute self-center text-accent font-medium">{sexe.female}%</span>
            </div>
        )
    }

    return (
        <div className="flex flex-row justify-center w-full h-8">
            <div className="flex justify-center items-center bg-[#5bc0de] rounded-l-lg border-b-2 border-l-2 border-t-2 border-slate-300" style={{ width: `${sexe?.male}%` }}>
                <span className="text-center text-accent font-medium">
                    {sexe?.male}%
                </span>
            </div>

            <div className="flex justify-center items-center bg-[#ffc0cb] rounded-r-lg border-b-2 border-r-2 border-t-2 border-slate-300" style={{ width: `${sexe?.female}%` }}>
                <span className="text-center text-accent font-medium">
                    {sexe?.female}%
                </span>
            </div>
        </div>
    )
}