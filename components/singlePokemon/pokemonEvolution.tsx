'use client'

import { Evolution, Pokemon } from "@/app/type";
import PokemonFoilImg from "../generic/pokemonFoilImg";
import PokemonEvol from "../generic/pokemonEvol";

type PokemonEvolutionProps = {
    pokemon: Pokemon;
}

function getPokemonEvols(pokemon: Pokemon) {
    const evols: { pokedex_id: number, name: string, condition: string }[] = [];

    if (pokemon.evolution == null) return evols

    // Il s'agit du pokemon de départ
    if (pokemon.evolution.pre == null && pokemon.evolution.next != null) {
        evols.push({ pokedex_id: pokemon.pokedex_id, name: pokemon.name.fr, condition: "" })
        pokemon.evolution.next.forEach((nextEvol: Evolution) => {
            evols.push({ pokedex_id: nextEvol.pokedex_id, name: nextEvol.name, condition: nextEvol.condition })
        });
    }

    if (pokemon.evolution.pre != null && pokemon.evolution.next != null) {
        pokemon.evolution.pre.forEach((preEvol: Evolution) => {
            evols.push({ pokedex_id: preEvol.pokedex_id, name: preEvol.name, condition: preEvol.condition })
        });
        evols.push({ pokedex_id: pokemon.pokedex_id, name: pokemon.name.fr, condition: "" })
        pokemon.evolution.next.forEach((nextEvol: Evolution) => {
            evols.push({ pokedex_id: nextEvol.pokedex_id, name: nextEvol.name, condition: nextEvol.condition })
        });
    }

    if (pokemon.evolution.pre != null && pokemon.evolution.next == null) {
        pokemon.evolution.pre.forEach((preEvol: Evolution) => {
            evols.push({ pokedex_id: preEvol.pokedex_id, name: preEvol.name, condition: preEvol.condition })
        });
        evols.push({ pokedex_id: pokemon.pokedex_id, name: pokemon.name.fr, condition: "" })
    }

    return evols
}


export default function PokemonEvolution({ pokemon }: PokemonEvolutionProps) {

    const evols = getPokemonEvols(pokemon);

    return (
        <div className="flex flex-row flex-wrap gap-8 items-center justify-center">
            {evols.length > 0 ?
                <>
                    {evols.map((evol, index: number) => {
                        return (
                            <div key={`${pokemon.pokedex_id}_evol_${index}`}>
                                <PokemonEvol pokemon={pokemon} evol={evol} />
                            </div>
                        )
                    })}

                </>
                : <p className="p-1 text-xs sm:text-sm text-center">Ce pokémon ne possède pas d&apos;évolution</p>
            }
        </div>
    )
}