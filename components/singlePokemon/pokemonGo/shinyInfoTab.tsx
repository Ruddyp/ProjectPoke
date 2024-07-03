'use client'

import { PoGoApiShinyPokemon, PoGoApiShinyPokemonList, Pokemon } from "@/app/type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

type ShinyInfoTabProps = {
    pokemon: Pokemon;
}

function findShinyDataByPokemonId(shinyData: PoGoApiShinyPokemonList, id: number) {
    return shinyData[id] || null;
}

export default function ShinyInfoTab({ pokemon }: ShinyInfoTabProps) {
    const [shinyData, setShinyData] = useState<PoGoApiShinyPokemon | null>(null)
    console.log("shinyData", shinyData);

    useEffect(() => {
        // Recuperation dinfops d'obtention des shiny de PoGoApi
        async function getPoGoApiShinyPokemon() {
            const url = `https://pogoapi.net/api/v1/shiny_pokemon.json`
            const response = await fetch(url, {
                method: 'GET',
            });
            const shinyJson: PoGoApiShinyPokemonList = await response.json();
            const pokemonShinyData = findShinyDataByPokemonId(shinyJson, pokemon.pokedex_id)
            setShinyData(pokemonShinyData);
        }
        getPoGoApiShinyPokemon();
    }, [])

    if (shinyData == null) {
        return <p className="p-1 text-xs sm:text-sm text-center">Ce pokémon ne peut pas être shiny.</p>
    }

    function badge(condition: boolean) {
        if (condition) {
            return (
                <div className="flex flex-row items-center w-min text-background bg-green-500 font-bold py-0.5 px-2 sm:py-1 sm:px-3 rounded-full">
                    Oui
                    <Check className="ml-2 h-5 w-5" />
                </div>
            )
        }

        return (
            <div className="flex flex-row items-center w-min text-background bg-[#ff7675] font-bold py-0.5 px-2 sm:py-1 sm:px-3 rounded-full">
                <p>Non</p>
                <X className="ml-1 h-5 w-5" />
            </div>
        )
    }

    return (
        <Card className="m-0.5 rounded-md border border-slate-500">
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                <CardTitle className="text-sm sm:text-base">
                    Obtention du shiny
                </CardTitle>
            </CardHeader>
            <CardContent className="p-1 text-xs sm:text-sm">
                <table className="w-full table-fixed">
                    <thead>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 text-right font-medium">Dans un oeuf :</td>
                            <td className="p-2">{badge(shinyData.found_egg)}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 text-right font-medium">Via une évolution :</td>
                            <td className="p-2">{badge(shinyData.found_evolution)}</td>
                        </tr>

                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 text-right font-medium">Dans un photobomb :</td>
                            <td className="p-2">{badge(shinyData.found_photobomb)}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 text-right font-medium">Dans un raid :</td>
                            <td className="p-2">{badge(shinyData.found_raid)}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 text-right font-medium">Dans une étude de recherche :</td>
                            <td className="p-2">{badge(shinyData.found_research)}</td>
                        </tr>
                        <tr>
                            <td className="text-red-400 p-2 text-right font-medium">Dans la nature :</td>
                            <td className="p-2">{badge(shinyData.found_wild)}</td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    )
}