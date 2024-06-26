'use client'

import { Pokemon, PokemonTypes } from "@/app/type";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import Image from 'next/image'

type PokemonInfoGenTableProps = {
    pokemon: Pokemon;
}

export default function PokemonInfoGenTable({ pokemon }: PokemonInfoGenTableProps) {

    return (
        <Card className="m-0.5 rounded-md border border-slate-500">
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0">
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
                            <td className="text-red-400 p-2">Numéro pokédex:</td>
                            <td className="p-2">N° {pokemon.pokedex_id}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2">Génération:</td>
                            <td className="p-2">{pokemon.generation}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2">Types:</td>
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
                            <td className="text-red-400 p-2">Catégorie:</td>
                            <td className="p-2">{pokemon.category}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2">Poids:</td>
                            <td className="p-2">{pokemon.weight != null ? pokemon.weight : "Poids inconnu"}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2">Taille:</td>
                            <td className="p-2">{pokemon.height != null ? pokemon.height : "Taille inconnu"}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2">Répartition des sexes:</td>
                            <td className="p-2">
                                {
                                    pokemon.sexe != null ?
                                        <div className="relative flex flex-row justify-center w-full h-8">
                                            <div className="bg-[#5bc0de] rounded-l-lg border-b-2 border-l-2 border-t-2 border-white" style={{ width: `${pokemon.sexe?.male}%` }}></div>

                                            <div className="bg-[#ffc0cb] rounded-r-lg border-b-2 border-r-2 border-t-2 border-white" style={{ width: `${pokemon.sexe?.female}%` }}></div>
                                            <span className="absolute self-center text-accent font-medium">{pokemon.sexe?.male}% - {pokemon.sexe?.female}% </span>
                                        </div>
                                        : "Répartition inconnue"
                                }
                            </td>
                        </tr>
                        <tr>
                            <td className="text-red-400 p-2">Exp pour le lvl 100:</td>
                            <td className="p-2">{pokemon.level_100 != null ? pokemon.level_100.toLocaleString() : "Exp inconnu"}</td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    )
}