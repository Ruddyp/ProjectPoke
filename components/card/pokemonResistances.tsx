'use client'

import { Pokemon, Types } from "@/app/type"
import PokemonResistance from "./pokemonResistance";

type PokemonResistancesProps = {
    pokemon: Pokemon;
    types: Types[];
}

export default function PokemonResistances({ pokemon, types }: PokemonResistancesProps) {
    const { resistances } = pokemon;
    const immuneTypes = resistances.filter((resistance) => resistance.multiplier == 0);
    const veryResistant = resistances.filter((resistance) => resistance.multiplier == 0.25);
    const resistant = resistances.filter((resistance) => resistance.multiplier == 0.5);
    const vulnerable = resistances.filter((resistance) => resistance.multiplier == 2);
    const veryVulnerable = resistances.filter((resistance) => resistance.multiplier == 4);

    return (
        <>
            <div className="hidden justify-center bg-gradient-to-b from-[#9d9d9d] via-[#ffffff] to-[#9d9d9d] p-1 sm:p-2">
                <span className="text-black text-sm sm:text-base">Faiblesses et résistances</span>
            </div>
            <div className="flex flex-row my-2 items-center justify-center flex-wrap">
                {immuneTypes.length > 0 ?
                    <>
                        <PokemonResistance resistances={immuneTypes} text={"Immunisé"} types={types} pokemonName={pokemon.name.fr} />
                    </>
                    : null
                }
                {veryResistant.length > 0 ?
                    <>
                        <PokemonResistance resistances={veryResistant} text={"Résistant x2"} types={types} pokemonName={pokemon.name.fr} />
                    </>
                    : null
                }
                {resistant.length > 0 ?
                    <>
                        <PokemonResistance resistances={resistant} text={"Résistant"} types={types} pokemonName={pokemon.name.fr} />
                    </>
                    : null
                }
                {vulnerable.length > 0 ?
                    <>
                        <PokemonResistance resistances={vulnerable} text={"Vulnérable"} types={types} pokemonName={pokemon.name.fr} />
                    </>
                    : null
                }
                {veryVulnerable.length > 0 ?
                    <>
                        <PokemonResistance resistances={veryVulnerable} text={"Vulnérable x2"} types={types} pokemonName={pokemon.name.fr} />
                    </>
                    : null
                }
            </div>
        </>
    )
}