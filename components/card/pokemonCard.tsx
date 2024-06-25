'use client'

import { useState } from "react"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { colors, isEvolution } from "@/lib/utils"
import { Pokemon, PokemonColorType, PokemonTypes, Types } from "@/app/type"
import { Badge } from "../ui/badge"
import PokemonCardTabs from "./pokemonCardTabs"
import BackgroundXO from "../backgroundXO"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card"

type PokemonCardProps = {
    pokemon: Pokemon;
    types: Types[];
}

function getCardBgColor(types: PokemonTypes[]) {

    console.log("types", types)

    const colorType1 = types[0].name.toLowerCase() as PokemonColorType;

    if (types.length > 1) {
        const colorType2 = types[1].name.toLowerCase() as PokemonColorType;
        return {
            backgroundImage: `linear-gradient(to right bottom, ${colors[colorType1]} 20%, ${colors[colorType2]})`
        }
    } else {
        const colorType1Light = `${colorType1}_light` as PokemonColorType;
        return {
            backgroundImage: `radial-gradient(circle 400px at 50% 200px,${colors[colorType1]},${colors[colorType1Light]})`
        }
    }
}


export default function PokemonCard({ pokemon, types }: PokemonCardProps) {

    const [srcSprite, setSrcSprite] = useState({
        img: pokemon.sprites.regular,
        text: "normal"
    });
    const router = useRouter();
    const styleCardBgColor = getCardBgColor(pokemon.types)
    const badgeText = isEvolution(pokemon.evolution) ? "EVOL" : "BASE";
    return (
        <div className="relative h-full w-full bg-background">
            <Card className={`w-[350px] h-[450px] xs:w-[400px] xs:h-[500px] sm:w-[500px] sm:h-[600px] border-0 outline outline-offset-0 outline-8 outline-[#ffe165] rounded-xl transition hover:scale-105`} style={styleCardBgColor}>
                <BackgroundXO className="rounded-xl" plusColor="#50413f" plusSize={60} />
                <Badge className="absolute -ml-1 mt-2 p-1 px-2 bg-gradient-to-b from-[#9d9d9d] via-[#ffffff] to-[#9d9d9d] text-[#5b575a] italic shadow-lg">{badgeText}</Badge>
                <CardHeader className="relative flex flex-row p-0 py-1">
                    <CardTitle className="text-xl ml-14 sm:text-2xl text-black">{pokemon.name.fr}</CardTitle>
                    <span className="text-xs sm:text-sm text-black italic ml-1">{`(${srcSprite.text})`}</span>
                    <span className="ml-auto text-sm sm:text-base text-black self-center sm:self-end">PV</span>
                    <span className="text-2xl sm:text-3xl text-black font-bold self-start">{pokemon.stats.hp}</span>
                    <div className="flex flex-row gap-1 ml-1 mr-2">
                        {pokemon.types.map((type: PokemonTypes, index: number) => {
                            return (
                                <div key={`${pokemon.pokedex_id}_type_${index}`} className="relative size-6 sm:size-8">
                                    <TooltipProvider delayDuration={200}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <Image
                                                    src={type.image}
                                                    alt={type.name}
                                                    width={64}
                                                    height={64}
                                                    quality={100}
                                                    className="border-2 border-slate-200 rounded-full size-6 sm:size-8 sm:m-1"
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent sideOffset={10}>
                                                <p>{type.name}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>)
                        })}
                    </div>
                </CardHeader>
                <CardContent className="relative flex flex-col bg-gradient-to-b from-[#9d9d9d] via-[#ffffff] to-[#9d9d9d] sm:mt-1 p-1 mx-5 xs:mx-8 sm:mx-12 rounded-md">
                    <div onClick={() => router.push(`/pokemon/${pokemon.pokedex_id}`)} className="flex flex-row h-full w-full items-center justify-center bg-background rounded-md cursor-pointer">
                        <Image
                            src={srcSprite.img}
                            alt={"Pokemon sprites"}
                            width={256}
                            height={256}
                            quality={100}
                            priority
                            className="size-48 xs:size-56 sm:size-64"
                        />
                    </div>
                    <div className="flex flex-col bg-gradient-to-b from-[#9d9d9d] via-[#ffffff] to-[#9d9d9d] items-center justify-center" >
                        <p className="text-[#5b575a] text-xs sm:text-sm font-medium">N°{pokemon.pokedex_id}&nbsp;/&nbsp;{pokemon.category}&nbsp;/&nbsp;{pokemon.height}&nbsp;/&nbsp;{pokemon.weight}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col justify-center items-center mt-2 sm:mt-4 gap-1.5 sm:gap-3 p-0">
                    <PokemonCardTabs pokemon={pokemon} setSrcSprite={setSrcSprite} types={types} />
                </CardFooter>
            </Card>
        </div>
    )
}