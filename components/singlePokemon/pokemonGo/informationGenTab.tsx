'use client'

import { PoGoApiBuddyDistance, PoGoApiBuddyDistanceList, PoGoApiPokemonMaxCp, Pokemon } from "@/app/type"
import { useEffect, useState } from "react";
import PokemonInfoGenTable from "../pokemonInfoGenTable";
import PokemonInfoGenStats from "../pokemonInfoGenStats";
import PokemonTalent from "@/components/generic/pokemonTalent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InformationGenTabProps = {
    pokemon: Pokemon;
}

function getPokemonMaxCp(pokemonId: number, pokemonMaxCpJson: PoGoApiPokemonMaxCp[]) {
    return pokemonMaxCpJson.find((pokemon) => pokemon.pokemon_id == pokemonId && pokemon.form == "Normal")
}

function getBuddyDistance(pokemonId: number, buddyDistanceJson: PoGoApiBuddyDistanceList) {
    for (const key in buddyDistanceJson) {
        if (buddyDistanceJson.hasOwnProperty(key)) {
            const pokemonList = buddyDistanceJson[key];
            const buddyDistance = pokemonList.find(pokemon => pokemon.pokemon_id === pokemonId && pokemon.form == "Normal");
            if (buddyDistance) {
                return buddyDistance;
            }
        }
    }
    return undefined;
}

export default function InformationGenTab({ pokemon }: InformationGenTabProps) {
    const [pokemonMaxCp, setPokemonMaxCp] = useState<PoGoApiPokemonMaxCp | undefined>(undefined)
    const [buddyDistance, setBuddyDistance] = useState<PoGoApiBuddyDistance | undefined>(undefined)
    console.log("pokemonMaxCp", pokemonMaxCp);
    console.log("buddyDistance", buddyDistance);

    useEffect(() => {
        // Recuperation dinfops d'obtention des shiny de PoGoApi
        async function getPoGoApiPokemonMaxCp() {
            const url = `https://pogoapi.net/api/v1/pokemon_max_cp.json`
            const response = await fetch(url, {
                method: 'GET',
            });
            const pokemonMaxCpJson: PoGoApiPokemonMaxCp[] = await response.json();
            const pokemonMaxCp = getPokemonMaxCp(pokemon.pokedex_id, pokemonMaxCpJson)
            setPokemonMaxCp(pokemonMaxCp);
        }

        async function getPoGoApiBuddyDistance() {
            const url = `https://pogoapi.net/api/v1/pokemon_buddy_distances.json`
            const response = await fetch(url, {
                method: 'GET',
            });
            const buddyDistanceJson: PoGoApiBuddyDistanceList = await response.json();
            const buddyDistance = getBuddyDistance(pokemon.pokedex_id, buddyDistanceJson)
            setBuddyDistance(buddyDistance);
        }
        getPoGoApiPokemonMaxCp();
        getPoGoApiBuddyDistance();
    }, [])

    if (pokemonMaxCp == undefined && buddyDistance == undefined) {
        return <p className="p-1 text-xs sm:text-sm text-center">Ce pokémon n&apos;est pas présent dans pokémon GO</p>
    }

    return (
        <Card className="m-0.5 rounded-md border border-slate-500">
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                <CardTitle className="text-sm sm:text-base">
                    Informations Générales
                </CardTitle>
            </CardHeader>
            <CardContent className="p-1 text-xs sm:text-sm">
                <table className="w-full table-fixed">
                    <thead>
                    </thead>
                    <tbody>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 text-right font-medium">Max CP:</td>
                            <td className="p-2">{pokemonMaxCp != undefined ? <span className="font-bold">{pokemonMaxCp.max_cp}</span> : "Inconnu"}</td>
                        </tr>
                        <tr className="border-b border-slate-500">
                            <td className="text-red-400 p-2 text-right font-medium">Distance copain:</td>
                            <td className="p-2">{pokemonMaxCp != undefined ? <span className="font-bold">{buddyDistance?.distance} km</span> : "Inconnu"}</td>
                        </tr>
                    </tbody>
                </table>
            </CardContent>
        </Card>
    )
}