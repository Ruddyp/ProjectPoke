'use client';

import { Types } from "@/app/type";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dispatch, SetStateAction, useState } from "react";

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
                            const style = isTypeActive(name, typeFilter) ? "bg-plante" : "bg-accent";
                            return (
                                <div key={`${type.name.fr}-filter_type-${index}`} className="p-0.5">
                                    <TooltipProvider delayDuration={200}>
                                        <Tooltip>
                                            <TooltipTrigger onClick={() => setTypeFilter({
                                                ...typeFilter,
                                                [type.name.fr.toLocaleLowerCase()]: !state
                                            })}>
                                                <div className={`${style} p-1.5 rounded-xl`}>
                                                    <Image
                                                        src={type.sprites}
                                                        alt={type.name.fr}
                                                        width={24}
                                                        height={24}
                                                        quality={100}
                                                        priority
                                                        className="border-2 border-slate-200 rounded-full size-7 sm:size-9"
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