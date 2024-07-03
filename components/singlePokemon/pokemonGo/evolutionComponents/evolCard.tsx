'use client'

import Image from 'next/image'
import { PoGoApiEvolution, PokeApiPokemonSpecies, Pokemon } from '@/app/type'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import EvolConditionTable from './evolConditionTable';

type EvolCardProps = {
    pokemon: Pokemon;
    evol: PoGoApiEvolution;
}

export default function EvolCard({ pokemon, evol }: EvolCardProps) {
    const router = useRouter();
    const [pokemonSpecies, setPokemonSpecies] = useState<PokeApiPokemonSpecies | undefined>(undefined)
    useEffect(() => {
        // Recuperation du PokemonSpecies de PokeApi
        // Je fais ça que pour avoir le descriptif du pokemon
        async function getPokeApiPokemonSpecies() {
            const url = `https://pokeapi.co/api/v2/pokemon-species/${evol.pokemon_id}`
            const response = await fetch(url, {
                method: 'GET',
            });
            const data: PokeApiPokemonSpecies = await response.json();
            setPokemonSpecies(data);
        }
        getPokeApiPokemonSpecies();
    }, [])

    const nameInfo = pokemonSpecies?.names.find(name => name.language.name === "fr");

    return (
        <Card className={`m-0.5 rounded-md border border-slate-500 max-w-64`}>
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                <CardTitle className="text-sm sm:text-base">
                    {nameInfo?.name ?? evol.pokemon_name}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-1 text-xs sm:text-sm text-center cursor-pointer">
                <div onClick={() => router.push(`/pokemon/${evol.pokemon_id}`)} className="relative size-48 xs:size-56 sm:size-64">
                    <Image
                        src={`https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${evol.pokemon_id}/regular.png`}
                        alt={nameInfo?.name ?? evol.pokemon_name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 475px) 192px, (max-width: 640px) 224px, 256px"
                        unoptimized
                    />
                </div>
            </CardContent>
            <CardFooter className='flex flex-col items-center justify-center p-0 m-0'>
                <CardTitle className='w-full border-t  border-slate-500 bg-muted/80 text-center text-sm sm:text-base'>
                    Conditions d&apos;évolution
                </CardTitle>
                <CardContent className='p-0'>
                    <EvolConditionTable evol={evol} />
                </CardContent>
            </CardFooter>
        </Card>
    )
}