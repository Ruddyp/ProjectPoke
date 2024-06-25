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
                {/* <div className="grid grid-cols-1 gap-1 p-4">
                    <div className="flex flex-row gap-2 items-center">
                        <span className="text-red-400 w-[75%] self-end">Numéro pokédex:</span>
                        <span className="text-red-400 w-[25%] self">N°{pokemon.pokedex_id}</span>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <span className="text-red-400 w-[75%] self-end">Génération:</span>
                        <span className="text-red-400 w-[25%] self">{pokemon.generation} génération</span>
                    </div>
                    <div className="flex w-[50%]">N°{pokemon.pokedex_id}</div>
                    <div className="flex justify-end font-bold text-red-400">Génération:</div><div className=" flex items-center justify-start">{pokemon.generation} génération</div>
                    <div className="flex justify-end font-bold text-red-400">Numéro du pokédex:</div><div className=" flex items-center justify-start">N°{pokemon.pokedex_id}</div>
                    <div className="flex justify-end font-bold text-red-400">Numéro du pokédex:</div><div className=" flex items-center justify-start">N°{pokemon.pokedex_id}</div>
                    <div>Génération</div><div>{pokemon.generation} génération</div>
                </div> */}
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
                                {pokemon.types.map((type: PokemonTypes, index: number) => {
                                    return (
                                        <div key={`${pokemon.pokedex_id}_type_${index}`}>
                                            <TooltipProvider delayDuration={200}>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Image
                                                            src={type.image}
                                                            alt={type.name}
                                                            width={64}
                                                            height={64}
                                                            quality={100}
                                                            className="border-2 border-slate-200 rounded-full size-6 sm:size-8"
                                                        />
                                                    </TooltipTrigger>
                                                    <TooltipContent sideOffset={10}>
                                                        <p>{type.name}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>)
                                })}
                            </td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2">Catégorie:</td>
                            <td className="p-2">{pokemon.category}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2">Poids:</td>
                            <td className="p-2">{pokemon.weight}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2">Taille:</td>
                            <td className="p-2">{pokemon.height}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2">Répartition des sexes:</td>
                            <td className="p-2">{pokemon.pokedex_id}</td>
                        </tr>
                        <tr>
                            <td className="text-red-400 p-2">Exp pour le lvl 100:</td>
                            <td className="p-2">{pokemon.level_100.toLocaleString()}</td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    )
}