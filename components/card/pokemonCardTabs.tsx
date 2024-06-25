'use client'

import { Dispatch, SetStateAction } from "react";
import { Images, Shield, Sparkles } from 'lucide-react';
import { Pokemon, Types } from "@/app/type";
import PokemonCardFormes from "./pokemonCardFormes";
import PokemonResistances from "./pokemonResistances";
import PokemonTalent from "./pokemonTalent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type PokemonCardTabsProps = {
    pokemon: Pokemon;
    setSrcSprite: Dispatch<SetStateAction<{ img: string; text: string; }>>;
    types: Types[];
}

export default function PokemonCardTabs({ pokemon, setSrcSprite, types }: PokemonCardTabsProps) {

    return (
        <Tabs defaultValue="formes" className="w-[300px] xs:w-[325px] sm:w-[390px] opacity-90">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger className="text-sm sm:text-base" value="formes">
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipContent sideOffset={10}>
                                <p className="text-xs sm:text-sm">Liste des formes</p>
                            </TooltipContent>
                            <TooltipTrigger asChild>
                                <Images className="items-center h-5 w-5 sm:h-7 sm:w-7" />
                            </TooltipTrigger>
                        </Tooltip>
                    </TooltipProvider>
                </TabsTrigger>
                <TabsTrigger className="text-sm sm:text-base" value="resistances">
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Shield className="items-center h-5 w-5 sm:h-7 sm:w-7" />
                            </TooltipTrigger>
                            <TooltipContent sideOffset={10}>
                                <p className="text-xs sm:text-sm">Faiblesses et résistances</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TabsTrigger>
                <TabsTrigger className="text-sm sm:text-base" value="talents">
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Sparkles className="items-center h-5 w-5 sm:h-7 sm:w-7" />
                            </TooltipTrigger>
                            <TooltipContent sideOffset={10}>
                                <p className="text-xs sm:text-sm">Liste des talents</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="formes">
                <PokemonCardFormes pokemon={pokemon} setSrcSprite={setSrcSprite} />
            </TabsContent>
            <TabsContent value="resistances">
                <PokemonResistances pokemon={pokemon} types={types} />
            </TabsContent>
            <TabsContent value="talents">
                <PokemonTalent pokemon={pokemon} />
            </TabsContent>
        </Tabs>
    )
}