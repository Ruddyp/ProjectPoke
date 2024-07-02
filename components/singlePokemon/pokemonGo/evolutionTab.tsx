'use client'

import { PoGoApiEvolution, PoGoApiEvolutions, Pokemon } from "@/app/type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from 'next/image'
import { useRouter } from "next/navigation";
import EvolCard from "./evolutionComponents/evolCard";

type EvolutionTabProps = {
    pokemon: Pokemon;
}

export default function EvolutionTab({ pokemon }: EvolutionTabProps) {
    const router = useRouter();
    const [evolutions, setEvolutions] = useState<PoGoApiEvolution[] | undefined>(undefined);

    console.log("evolutions", evolutions);

    useEffect(() => {
        // Recuperation dinfops d'obtention des shiny de PoGoApi
        async function getPoGoApiPokemonEvolutions() {
            const url = `https://pogoapi.net/api/v1/pokemon_evolutions.json`
            const response = await fetch(url, {
                method: 'GET',
            });
            const pokemonEvolutions: PoGoApiEvolutions[] = await response.json();
            const pokemonEvolution = pokemonEvolutions.find(evol => evol.pokemon_id == pokemon.pokedex_id)
            setEvolutions(pokemonEvolution?.evolutions);
        }
        getPoGoApiPokemonEvolutions();
    }, [])

    if (evolutions == undefined) {
        return <p className="p-1 text-xs sm:text-sm text-center">Ce pokémon n&apos;évolue pas.</p>
    }


    return (
        <Card className="m-0.5 rounded-md border border-slate-500">
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                <CardTitle className="text-sm sm:text-base">
                    Liste des évolutions
                </CardTitle>
            </CardHeader>
            <CardContent className="p-1 text-xs sm:text-sm flex flex-row flex-wrap gap-2 justify-center items-center">
                {evolutions.map((evol) => {
                    return (
                        <div key={`${pokemon.pokedex_id}-evol-${evol.pokemon_id}`}>
                            <EvolCard
                                pokemon={pokemon}
                                evol={evol}
                            />
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    )
}