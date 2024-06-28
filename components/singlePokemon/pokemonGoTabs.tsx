'use client'

import { Pokemon } from "@/app/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Suspense, lazy } from "react";
import InformationGenTab from "./pokemonGo/informationGenTab";

const ShinyInfoTab = lazy(() => import('./pokemonGo/shinyInfoTab'));

type PokemonGoTabsProps = {
    pokemon: Pokemon;
}

export default function PokemonGoTabs({ pokemon }: PokemonGoTabsProps) {

    return (
        <Tabs defaultValue="info_gen_go" className="w-[80%] opacity-90">
            <TabsList className="grid grid-rows-1 sm:grid-cols-3 justify-stretch">
                <TabsTrigger className="flex text-sm sm:text-base" value="info_gen_go">
                    <p className="text-xs sm:text-sm text-wrap">Informations</p>
                </TabsTrigger>
                <TabsTrigger className="flex text-sm sm:text-base" value="shiny">
                    <p className="text-xs sm:text-sm text-wrap">Shiny</p>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="info_gen_go">
                <Suspense fallback={"Chargement ..."}>
                    <InformationGenTab pokemon={pokemon} />
                </Suspense>
            </TabsContent>
            <TabsContent value="shiny">
                <Suspense fallback={"Chargement ..."}>
                    <ShinyInfoTab pokemon={pokemon} />
                </Suspense>
            </TabsContent>
        </Tabs>
    )
}