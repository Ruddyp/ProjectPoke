'use client'

import { Pokemon, Types } from "@/app/type";
import Image from 'next/image'
import PokemonInfoGenTable from "./pokemonInfoGenTable";
import PokemonResistances from "../card/pokemonResistances";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type PokemonInfoGenResistancesProps = {
    pokemon: Pokemon;
    types: Types[];
}

export default function PokemonInfoGenResistances({ pokemon, types }: PokemonInfoGenResistancesProps) {

    return (
        <Card className="m-0.5 rounded-md border border-slate-500">
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0">
                <CardTitle className="text-xs sm:text-sm">
                    Faiblesses et résistances
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-xs sm:text-sm">
                <PokemonResistances pokemon={pokemon} types={types} />
            </CardContent>
        </Card>
    )
}