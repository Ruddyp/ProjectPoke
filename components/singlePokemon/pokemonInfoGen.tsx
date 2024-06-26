'use client'

import { Pokemon } from "@/app/type";
import Image from 'next/image'
import PokemonInfoGenTable from "./pokemonInfoGenTable";

type PokemonInfoGenProps = {
    pokemon: Pokemon;
}

export default function PokemonInfoGen({ pokemon }: PokemonInfoGenProps) {

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
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
        </div>
    )
}