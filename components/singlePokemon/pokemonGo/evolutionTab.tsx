'use client'

import { PoGoApiEvolution, PoGoApiEvolutions, Pokemon } from "@/app/type"
import { useEffect, useState } from "react";
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
        <div className="p-1 text-xs sm:text-sm flex flex-row flex-wrap gap-2 justify-center items-start">
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
        </div>
    )
}