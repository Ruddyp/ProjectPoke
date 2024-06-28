'use client'

import { Pokemon, Types } from "@/app/type";
import Image from 'next/image'
import PokemonInfoGenTable from "./pokemonInfoGenTable";
import PokemonInfoGenResistances from "./pokemonInfoGenResistances";
import PokemonTalent from "../generic/pokemonTalent";
import PokemonInfoGenStats from "./pokemonInfoGenStats";

type PokemonInfoGenTabProps = {
    pokemon: Pokemon;
    types: Types[];
}

export default function PokemonInfoGenTab({ pokemon, types }: PokemonInfoGenTabProps) {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex items-center justify-center">
                <Image
                    src={pokemon.sprites.regular}
                    alt={`Image de ${pokemon.name.fr}`}
                    width={512}
                    height={512}
                    quality={100}
                    priority
                    className="size-48 xs:size-56 sm:size-64 md:size-72 lg:size-80"
                    unoptimized
                />
            </div>
            <div>
                <PokemonInfoGenTable pokemon={pokemon} />
            </div>
            <div className="col-span-1 sm:col-span-2">
                <PokemonInfoGenResistances pokemon={pokemon} types={types} />
            </div>
            <div className="col-span-1 sm:col-span-2">
                <PokemonInfoGenStats pokemon={pokemon} />
            </div>
            <div className="col-span-1 sm:col-span-2">
                <PokemonTalent pokemon={pokemon} />
            </div>
        </div>
    )
}