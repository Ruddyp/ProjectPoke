'use client'

import Image from 'next/image'
import { PokemonResistances, Types } from "@/app/type"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type PokemonResistanceProps = {
    resistances: PokemonResistances[];
    text: string;
    types: Types[];
    pokemonName: string;
}

export default function PokemonResistance({ resistances, text, types, pokemonName }: PokemonResistanceProps) {

    return (
        <>
            <div className="flex flex-col">
                <Card className="m-0.5 rounded-md">
                    <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                        <CardTitle className="text-xs sm:text-sm">
                            {text}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-xs">
                        <div className="flex flex-row items-center justify-center gap-1 p-1">
                            {resistances.map((resistance: PokemonResistances, index: number) => {
                                const findTypeInfos = types.find((type: Types) => type.name.fr == resistance.name);
                                if (findTypeInfos == undefined) return null
                                return (
                                    <div key={`${pokemonName}-resi-${findTypeInfos?.name.fr}`}>
                                        <TooltipProvider delayDuration={200}>
                                            <Tooltip>
                                                <TooltipTrigger className='relative rounded-full size-5 sm:size-6'>
                                                    <Image
                                                        src={findTypeInfos.sprites}
                                                        alt={findTypeInfos.name.fr}
                                                        fill
                                                        sizes="(max-width: 640px) 32px, 48px"
                                                        className="border-2 border-slate-200 rounded-full object-cover"
                                                        unoptimized
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{findTypeInfos.name.fr}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}