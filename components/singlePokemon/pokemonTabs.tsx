'use client'

import { Suspense, lazy } from "react";
import { Pokemon, Types } from "@/app/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const PokemonInfoGen = lazy(() => import('./pokemonInfoGen'));
const PokemonImagerie = lazy(() => import('./pokemonImagerie'));
const PokemonEvolution = lazy(() => import('./pokemonEvolution'));

type PokemonTabsProps = {
    pokemon: Pokemon;
    types: Types[]
}

export default function PokemonTabs({ pokemon, types }: PokemonTabsProps) {

    return (
        <Tabs defaultValue="information" className="w-full opacity-90">
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
                    <PokemonInfoGen pokemon={pokemon} types={types} />
                </Suspense>
            </TabsContent>
            <TabsContent value="evolution">
                <Suspense fallback={"Chargement ..."}>
                    <PokemonEvolution pokemon={pokemon} />
                </Suspense>
            </TabsContent>
            <TabsContent value="imagerie">
                <Suspense fallback={"Chargement ..."}>
                    <PokemonImagerie pokemon={pokemon} />
                </Suspense>
            </TabsContent>
            <TabsContent value="pokemon_go">
            </TabsContent>
        </Tabs>
    )
}