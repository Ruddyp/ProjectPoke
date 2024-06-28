'use client'

import { PokeApiPokemonSpecies } from "@/app/type"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type PokemonDescriptionProps = {
    pokemonSpecies: PokeApiPokemonSpecies | null;
}

export default function PokemonDescription({ pokemonSpecies }: PokemonDescriptionProps) {
    const description = pokemonSpecies?.flavor_text_entries.find((desc) => desc.language.name == "fr");

    return (
        <Card className="border-0 w-full">
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 border-t border-slate-500">
                <CardTitle className="text-sm sm:text-base">
                    Description
                </CardTitle>
            </CardHeader>
            <CardContent className="p-1 text-xs sm:text-sm text-center">
                {description != undefined ? description.flavor_text : "Aucune description disponible"}
            </CardContent>
        </Card>
    )
}