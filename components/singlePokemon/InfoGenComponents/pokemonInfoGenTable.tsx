'use client'

import { PokeApiPokemon, Pokemon, PokemonTypes } from "@/app/type";
import Image from 'next/image'
import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import PokemonGenderStats from "@/components/generic/pokemonGenderStats";

type PokemonInfoGenTableProps = {
    pokemon: Pokemon;
}

export default function PokemonInfoGenTable({ pokemon }: PokemonInfoGenTableProps) {
    const [pokeApiPokemon, setPokeApiPokemon] = useState<PokeApiPokemon | null>(null)

    useEffect(() => {
        // Getting pokemon info from pokeapi
        // Je fais ça que pour avoir le son du cri du pokemon (pour le moment)
        async function getPokeApiInfo() {
            const url = `https://pokeapi.co/api/v2/pokemon/${pokemon.pokedex_id}`
            const response = await fetch(url, {
                method: 'GET',
            });
            const data: PokeApiPokemon = await response.json();
            setPokeApiPokemon(data);
        }
        getPokeApiInfo();
    }, [])

    const audioRef = useRef<HTMLAudioElement>(null);

    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.volume = 0.2;
            audioRef.current.play();
        }
    };

    return (
        <Card className="m-0.5 rounded-md border border-slate-500">
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                <CardTitle className="text-xs sm:text-sm">
                    Informations Générales
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-xs sm:text-sm">
                <table className="w-full table-auto">
                    <thead>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 font-medium">Numéro pokédex:</td>
                            <td className="p-2">N° {pokemon.pokedex_id}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 font-medium">Génération:</td>
                            <td className="p-2">{pokemon.generation}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 font-medium">Types:</td>
                            <td className="p-2 flex flex-row gap-1.5">
                                {
                                    pokemon.types != null ?
                                        pokemon.types.map((type: PokemonTypes, index: number) => {
                                            return (
                                                <div key={`${pokemon.pokedex_id}_type_${index}`}>
                                                    <TooltipProvider delayDuration={200}>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Image
                                                                    src={type.image}
                                                                    alt={type.name}
                                                                    width={32}
                                                                    height={32}
                                                                    quality={75}
                                                                    className="border-2 border-slate-200 rounded-full size-6 sm:size-8"
                                                                    unoptimized
                                                                />
                                                            </TooltipTrigger>
                                                            <TooltipContent sideOffset={10}>
                                                                <p>{type.name}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>)
                                        })
                                        : <p>Ce pokémon n&apos;a pas de type</p>
                                }
                            </td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 font-medium">Catégorie:</td>
                            <td className="p-2">{pokemon.category}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 font-medium">Poids:</td>
                            <td className="p-2">{pokemon.weight != null ? pokemon.weight : "Poids inconnu"}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 font-medium">Taille:</td>
                            <td className="p-2">{pokemon.height != null ? pokemon.height : "Taille inconnu"}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 font-medium">Répartition des sexes:</td>
                            <td className="p-2">
                                <PokemonGenderStats sexe={pokemon.sexe} />
                            </td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 font-medium">Exp pour le lvl 100:</td>
                            <td className="p-2">{pokemon.level_100 != null ? pokemon.level_100.toLocaleString() : "Exp inconnu"}</td>
                        </tr>
                        <tr>
                            <td className="text-red-400 p-2 font-medium">Cri:</td>
                            <td className="p-2">
                                {pokeApiPokemon != null ?
                                    <div onClick={handlePlay} className="flex items-center justify-center w-10 bg-accent border-2 border-white rounded-full cursor-pointer p-1 hover:bg-primary">
                                        <Play fill="white" color="white" className="rounded-full" />
                                        <audio
                                            ref={audioRef}
                                            className="hidden"
                                            controls
                                            src={pokeApiPokemon?.cries.latest}
                                        ></audio>
                                    </div>
                                    : "Aucun cri disponible"
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    )
}