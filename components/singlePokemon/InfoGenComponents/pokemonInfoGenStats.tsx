'use client'

import { Pokemon } from "@/app/type";
import PokemonStatBar from "@/components/generic/pokemonStatBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PokemonInfoGenStatsProps = {
    pokemon: Pokemon;
}

export default function PokemonInfoGenStats({ pokemon }: PokemonInfoGenStatsProps) {

    return (
        <Card className="m-0.5 rounded-md border border-slate-500">
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                <CardTitle className="text-xs sm:text-sm">
                    Statistiques
                </CardTitle>
            </CardHeader>
            <CardContent className="p-1 text-xs sm:text-sm text-center">
                {pokemon.stats == null ? <p>Ce pokémon ne possède aucunes statistiques</p> : null}
                {pokemon.stats != null ?
                    <>
                        <PokemonStatBar statKey="hp" value={pokemon.stats?.hp} />
                        <PokemonStatBar statKey="atk" value={pokemon.stats?.atk} />
                        <PokemonStatBar statKey="def" value={pokemon.stats?.def} />
                        <PokemonStatBar statKey="spe_atk" value={pokemon.stats?.spe_atk} />
                        <PokemonStatBar statKey="spe_def" value={pokemon.stats?.spe_def} />
                        <PokemonStatBar statKey="vit" value={pokemon.stats?.vit} />
                    </>
                    : null
                }
            </CardContent>
        </Card>
    )
}