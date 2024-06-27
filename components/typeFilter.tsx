'use client';

import { PokemonColorType, Types } from "@/app/type";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dispatch, SetStateAction } from "react";
import { colors } from "@/lib/utils";

type TypeFilterProps = {
    types: Types[]
    setTypeFilter: Dispatch<SetStateAction<TypeFilterType>>
    typeFilter: TypeFilterType
}

export type TypeFilterType = {
    plante: boolean;
    poison: boolean;
    feu: boolean;
    eau: boolean;
    vol: boolean;
    insecte: boolean;
    normal: boolean;
    électrik: boolean;
    sol: boolean;
    fée: boolean;
    combat: boolean;
    psy: boolean;
    roche: boolean;
    acier: boolean,
    glace: boolean,
    spectre: boolean,
    ténèbres: boolean,
    dragon: boolean;
}

export const typeFilterDefaultValue: TypeFilterType = {
    plante: false,
    poison: false,
    feu: false,
    eau: false,
    vol: false,
    insecte: false,
    normal: false,
    électrik: false,
    sol: false,
    fée: false,
    combat: false,
    psy: false,
    roche: false,
    acier: false,
    glace: false,
    spectre: false,
    ténèbres: false,
    dragon: false,
}

function isTypeActive(typeName: string, typesState: TypeFilterType) {
    return typesState[typeName as keyof TypeFilterType]
}

export default function TypeFilter({ types, setTypeFilter, typeFilter }: TypeFilterProps) {
    return (
        <>
            <Card className="m-0.5 rounded-lg border-2 border-accent">
                <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-accent/80 p-1 m-0">
                    <CardTitle className="text-sm sm:text-base">
                        Filtrage par type
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-1 text-xs sm:text-sm bg-background/40">
                    <div className="flex flex-row gap-1 flex-wrap items-center justify-center rounded-lg p-2">
                        {types.map((type: Types, index: number) => {
                            const name = type.name.fr.toLowerCase() as keyof TypeFilterType;
                            const state = typeFilter[name];
                            const typeColor = colors[name as PokemonColorType];
                            const bgColor = isTypeActive(name, typeFilter) ? `${typeColor}` : "#42496c";
                            return (
                                <div key={`${type.name.fr}-filter_type-${index}`} className="p-1">
                                    <TooltipProvider delayDuration={200}>
                                        <Tooltip>
                                            <TooltipTrigger onClick={() => setTypeFilter({
                                                ...typeFilter,
                                                [type.name.fr.toLocaleLowerCase()]: !state
                                            })}>
                                                <div className={`relative size-8 sm:size-10 rounded-md outline outline-offset-0 outline-slate-500`} style={{ backgroundColor: bgColor }}>
                                                    <Image
                                                        src={type.sprites}
                                                        alt={type.name.fr}
                                                        fill
                                                        sizes="(max-width: 640px) 32px, 48px"
                                                        className="rounded-full object-cover p-1"
                                                        unoptimized
                                                    />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{type.name.fr}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}