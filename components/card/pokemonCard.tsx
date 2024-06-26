'use client'

import { useState } from "react"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { isEvolution } from "@/lib/utils"
import { Pokemon, PokemonTypes, Types } from "@/app/type"
import { Badge } from "../ui/badge"
import PokemonCardTabs from "./pokemonCardTabs"
import BackgroundXO from "../backgroundXO"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"

type PokemonCardProps = {
    pokemon: Pokemon;
    types: Types[];
    indexCard: number;
}

export default function PokemonCard({ pokemon, types, indexCard }: PokemonCardProps) {
    const [srcSprite, setSrcSprite] = useState({
        img: pokemon.sprites.regular,
        text: "normal"
    });
    const router = useRouter();
    const badgeText = isEvolution(pokemon.evolution) ? "EVOL" : "BASE";
    return (
        <Card className={`w-[350px] h-[450px] xs:w-[400px] xs:h-[500px] relative sm:w-[500px] sm:h-[600px] border-0 outline outline-offset-0 outline-8 outline-[#ffe165] rounded-xl sm:transition sm:hover:scale-105`} style={pokemon.cardStyle}>
            <BackgroundXO className="rounded-xl" plusColor="#50413f" plusSize={60} />
            <Badge className="absolute -ml-1 mt-2 p-1 px-2 bg-gradient-to-b from-[#9d9d9d] via-[#ffffff] to-[#9d9d9d] text-[#5b575a] italic shadow-lg">{badgeText}</Badge>
            <CardHeader className="relative flex flex-row p-0 py-1">
                <CardTitle className="text-xl ml-14 sm:text-2xl text-black">{pokemon.name.fr}</CardTitle>
                <span className="text-xs sm:text-sm text-black italic ml-1">{`(${srcSprite.text})`}</span>
                {pokemon.stats != null ?
                    <>
                        <span className="ml-auto text-sm sm:text-base text-black self-center sm:self-end">PV</span>
                        <span className="text-2xl sm:text-3xl text-black font-bold self-start">{pokemon.stats.hp}</span>
                    </>
                    : null
                }
                <div className="flex flex-row gap-1 ml-1 mr-2">
                    {
                        pokemon.types != null ?
                            pokemon.types.map((type: PokemonTypes, index: number) => {
                                return (
                                    <div key={`${pokemon.pokedex_id}_type_${index}`} className="relative size-6 sm:size-8">
                                        <TooltipProvider delayDuration={200}>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Image
                                                        src={type.image}
                                                        alt={type.name}
                                                        fill
                                                        sizes="(max-width: 640px) 32px, 48px"
                                                        className="border-2 border-slate-200 rounded-full object-cover"
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
                            : null
                    }
                </div>
            </CardHeader>
            <CardContent className="relative flex flex-col bg-gradient-to-b from-[#9d9d9d] via-[#ffffff] to-[#9d9d9d] sm:mt-1 p-1 mx-5 xs:mx-8 sm:mx-12 rounded-md">
                <div className="flex flex-row h-full w-full items-center justify-center bg-background rounded-md cursor-pointer">
                    <div onClick={() => router.push(`/pokemon/${pokemon.pokedex_id}`)} className="relative size-48 xs:size-56 sm:size-64">
                        <Image
                            src={srcSprite.img}
                            alt={"Pokemon sprites"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 475px) 192px, (max-width: 640px) 224px, 256px"
                            priority={(indexCard >= 0 && indexCard < 4) ? true : false}
                            unoptimized
                        />
                    </div>
                </div>
                <div className="flex flex-col bg-gradient-to-b from-[#9d9d9d] via-[#ffffff] to-[#9d9d9d] items-center justify-center" >
                    <p className="text-[#5b575a] text-xs sm:text-sm font-medium">
                        N°{pokemon.pokedex_id}&nbsp;/&nbsp;{pokemon.category}&nbsp;
                        {pokemon.height != null ? `/ ${pokemon.height} ` : null}
                        {pokemon.weight != null ? `/ ${pokemon.weight} ` : null}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col justify-center items-center mt-2 sm:mt-4 gap-1.5 sm:gap-3 p-0">
                <PokemonCardTabs pokemon={pokemon} setSrcSprite={setSrcSprite} types={types} />
            </CardFooter>
        </Card>
    )
}