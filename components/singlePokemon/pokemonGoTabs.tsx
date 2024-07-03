'use client'

import { Pokemon, Types } from "@/app/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Dispatch, SetStateAction, Suspense, lazy, useEffect, useState } from "react";

const InformationGenTab = lazy(() => import('./pokemonGo/informationGenTab'));
const ShinyInfoTab = lazy(() => import('./pokemonGo/shinyInfoTab'));
const AttaquesTab = lazy(() => import('./pokemonGo/attaquesTab'));
const EvolutionTab = lazy(() => import('./pokemonGo/evolutionTab'));

type PokemonGoTabsProps = {
    pokemon: Pokemon;
    tab: string;
    setTab: Dispatch<SetStateAction<string>>
}

export default function PokemonGoTabs({ pokemon, tab, setTab }: PokemonGoTabsProps) {
    const [types, setTypes] = useState<Types[]>([])

    useEffect(() => {
        async function getTypes() {
            const url = "https://tyradex.tech/api/v1/types"
            const response = await fetch(url, {
                method: 'GET',
            });
            const types: Types[] = await response.json();
            setTypes(types);
        }
        getTypes();
    }, [])

    const handleTabChange = (value: string) => {
        setTab(value);
    };

    return (
        <Tabs value={tab} onValueChange={handleTabChange} className="w-[80%] opacity-90">
            <TabsList className="grid grid-rows-1 sm:grid-cols-3 justify-stretch">
                <TabsTrigger className="flex text-sm sm:text-base" value="info_gen_go">
                    <p className="text-xs sm:text-sm text-wrap">Informations</p>
                </TabsTrigger>
                <TabsTrigger className="flex text-sm sm:text-base" value="attack">
                    <p className="text-xs sm:text-sm text-wrap">Attaques</p>
                </TabsTrigger>
                <TabsTrigger className="flex text-sm sm:text-base" value="evol">
                    <p className="text-xs sm:text-sm text-wrap">Évolutions</p>
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
            <TabsContent value="attack">
                <Suspense fallback={"Chargement ..."}>
                    <AttaquesTab pokemon={pokemon} types={types} />
                </Suspense>
            </TabsContent>
            <TabsContent value="evol">
                <Suspense fallback={"Chargement ..."}>
                    <EvolutionTab pokemon={pokemon} />
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