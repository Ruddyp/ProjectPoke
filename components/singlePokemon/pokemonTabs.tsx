'use client'

import { Pokemon } from "@/app/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import PokemonInfoGen from './pokemonInfoGen';

type PokemonTabsProps = {
    pokemon: Pokemon;
}

export default function PokemonTabs({ pokemon }: PokemonTabsProps) {

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
                <PokemonInfoGen pokemon={pokemon} />
            </TabsContent>
            <TabsContent value="evolution">
            </TabsContent>
            <TabsContent value="imagerie">
            </TabsContent>
            <TabsContent value="pokemon_go">
            </TabsContent>
        </Tabs>
    )
}