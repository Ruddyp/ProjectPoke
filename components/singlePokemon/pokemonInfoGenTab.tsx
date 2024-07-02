'use client'

import { PokeApiPokemonSpecies, Pokemon, Types } from "@/app/type";
import Image from 'next/image'
import PokemonTalent from "../generic/pokemonTalent";
import { useEffect, useState } from "react";
import PokemonDescription from "./InfoGenComponents/pokemonDescription";
import PokemonInfoGenTable from "./InfoGenComponents/pokemonInfoGenTable";
import PokemonInfoGenResistances from "./InfoGenComponents/pokemonInfoGenResistances";
import PokemonInfoGenStats from "./InfoGenComponents/pokemonInfoGenStats";

type PokemonInfoGenTabProps = {
    pokemon: Pokemon;
    types: Types[];
}

export default function PokemonInfoGenTab({ pokemon, types }: PokemonInfoGenTabProps) {
    const [pokemonSpecies, setPokemonSpecies] = useState<PokeApiPokemonSpecies | null>(null)

    useEffect(() => {
        // Recuperation du PokemonSpecies de PokeApi
        // Je fais ça que pour avoir le descriptif du pokemon
        async function getPokeApiPokemonSpecies() {
            const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemon.pokedex_id}`
            const response = await fetch(url, {
                method: 'GET',
            });
            const data: PokeApiPokemonSpecies = await response.json();
            setPokemonSpecies(data);
        }
        getPokeApiPokemonSpecies();
    }, [])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col gap-1 items-center justify-between border border-slate-500 rounded-md m-0.5">
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
                <PokemonDescription pokemonSpecies={pokemonSpecies} />
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