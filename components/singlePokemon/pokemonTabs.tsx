'use client'

import { Dispatch, SetStateAction, Suspense, lazy, useEffect, useState } from "react";
import { Pokemon, Types } from "@/app/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useRouter } from "next/navigation";
import { usePathname } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

const PokemonInfoGenTab = lazy(() => import('./pokemonInfoGenTab'));
const PokemonImagerieTab = lazy(() => import('./pokemonImagerieTab'));
const PokemonEvolutionTab = lazy(() => import('./pokemonEvolutionTab'));
const PokemonGoTabs = lazy(() => import('./pokemonGoTabs'));

type PokemonTabsProps = {
    pokemon: Pokemon;
    types: Types[];
    tab: string;
    setTab: Dispatch<SetStateAction<string>>
    tabGo: string;
    setTabGo: Dispatch<SetStateAction<string>>
}

export default function PokemonTabs({ pokemon, types, tab, setTab, tabGo, setTabGo }: PokemonTabsProps) {

    const handleTabChange = (value: string) => {
        setTab(value);
    };

    return (
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full opacity-90">
            <TabsList className="grid grid-rows-1 sm:grid-cols-3 justify-stretch">
                <TabsTrigger className="flex text-sm sm:text-base" value="information">
                    <p className="text-xs sm:text-sm text-wrap">Informations</p>
                </TabsTrigger>
                <TabsTrigger className="flex text-sm sm:text-base" value="evolution">
                    <p className="text-xs sm:text-sm text-wrap">Évolutions</p>
                </TabsTrigger>
                <TabsTrigger className="flex text-sm sm:text-base" value="imagerie">
                    <p className="text-xs sm:text-sm text-wrap">Imageries</p>
                </TabsTrigger>
                <TabsTrigger className="flex text-sm sm:text-base" value="pokemon_go">
                    <p className="text-xs sm:text-sm text-wrap">Pokemon GO</p>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="information">
                <Suspense fallback={"Chargement ..."}>
                    <PokemonInfoGenTab pokemon={pokemon} types={types} />
                </Suspense>
            </TabsContent>
            <TabsContent value="evolution">
                <Suspense fallback={"Chargement ..."}>
                    <PokemonEvolutionTab pokemon={pokemon} />
                </Suspense>
            </TabsContent>
            <TabsContent value="imagerie">
                <Suspense fallback={"Chargement ..."}>
                    <PokemonImagerieTab pokemon={pokemon} />
                </Suspense>
            </TabsContent>
            <TabsContent className="flex items-center justify-center" value="pokemon_go">
                <Suspense fallback={"Chargement ..."}>
                    <PokemonGoTabs pokemon={pokemon} tab={tabGo} setTab={setTabGo} />
                </Suspense>
            </TabsContent>
        </Tabs>
    )
}