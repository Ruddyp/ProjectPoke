'use client'

import Image from 'next/image'
import { useEffect, useState } from "react";
import { PoGoApiBuddyDistance, PoGoApiCandyEvolve, PoGoApiJsonList, PoGoApiPokemonMaxCp, PoGoPokemonRarity, Pokemon } from "@/app/type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InformationGenTabProps = {
    pokemon: Pokemon;
}

function getPokemonMaxCp(pokemonId: number, pokemonMaxCpJson: PoGoApiPokemonMaxCp[]) {
    // J'ai enlevé la condition pokemon.form == "Normal" car certain pokemon n'ont pas de forme normal
    // return pokemonMaxCpJson.find((pokemon) => pokemon.pokemon_id == pokemonId && pokemon.form == "Normal")
    return pokemonMaxCpJson.find((pokemon) => pokemon.pokemon_id == pokemonId)
}

function getFromJsonList<T extends { pokemon_id: number; form: string }>(pokemonId: number, jsonList: PoGoApiJsonList<T>) {
    for (const key in jsonList) {
        if (jsonList.hasOwnProperty(key)) {
            const pokemonList = jsonList[key];
            // J'ai enlevé la condition pokemon.form == "Normal" car certain pokemon n'ont pas de forme normal
            // const buddyDistance = pokemonList.find(pokemon => pokemon.pokemon_id === pokemonId && pokemon.form == "Normal"); 
            const buddyDistance = pokemonList.find(pokemon => pokemon.pokemon_id === pokemonId);
            if (buddyDistance) {
                return buddyDistance;
            }
        }
    }
    return undefined;
}

function getRarityColor(pokemonRarity: PoGoPokemonRarity | undefined) {
    if (pokemonRarity == undefined) return undefined

    if (pokemonRarity.rarity == "Standard") {
        return "bg-gradient-to-b from-[#9d9d9d] via-[#ffffff] to-[#9d9d9d] text-[#5b575a]"
    }

    if (pokemonRarity.rarity == "Legendary") {
        return "bg-gradient-to-b from-[#d97706] via-[#fbbf24] to-[#d97706] text-[#92400e]"
    }

    if (pokemonRarity.rarity == "Mythic") {
        return "bg-gradient-to-b from-[#9333ea] via-[#e879f9] to-[#9333ea] text-[#86198f]"
    }
}

export default function InformationGenTab({ pokemon }: InformationGenTabProps) {
    const [pokemonMaxCp, setPokemonMaxCp] = useState<PoGoApiPokemonMaxCp | undefined>(undefined);
    const [buddyDistance, setBuddyDistance] = useState<PoGoApiBuddyDistance | undefined>(undefined);
    const [candyEvolve, setCandyEvolve] = useState<PoGoApiCandyEvolve | undefined>(undefined);
    const [pokemonRarity, setPokemonRarity] = useState<PoGoPokemonRarity | undefined>(undefined);
    console.log("pokemon", pokemon);
    console.log("pokemonMaxCp", pokemonMaxCp);
    console.log("buddyDistance", buddyDistance);
    console.log("candyEvolve", candyEvolve);
    console.log("pokemonRarity", pokemonRarity);

    useEffect(() => {
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
            const buddyDistanceJson: PoGoApiJsonList<PoGoApiBuddyDistance> = await response.json();
            const buddyDistance = getFromJsonList(pokemon.pokedex_id, buddyDistanceJson)
            setBuddyDistance(buddyDistance);
        }

        async function getPoGoApiCandyEvolve() {
            const url = `https://pogoapi.net/api/v1/pokemon_candy_to_evolve.json`
            const response = await fetch(url, {
                method: 'GET',
            });
            const candyEvolveList: PoGoApiJsonList<PoGoApiCandyEvolve> = await response.json();
            console.log("candyEvolveList", candyEvolveList)
            const candyEvolve = getFromJsonList(pokemon.pokedex_id, candyEvolveList)
            setCandyEvolve(candyEvolve);
        }

        async function getPoGoApiPokemonRarity() {
            const url = `https://pogoapi.net/api/v1/pokemon_rarity.json`
            const response = await fetch(url, {
                method: 'GET',
            });
            const pokemonRarityList: PoGoApiJsonList<PoGoPokemonRarity> = await response.json();
            const pokemonRarity = getFromJsonList(pokemon.pokedex_id, pokemonRarityList)
            setPokemonRarity(pokemonRarity);
        }


        getPoGoApiPokemonMaxCp();
        getPoGoApiBuddyDistance();
        getPoGoApiCandyEvolve();
        getPoGoApiPokemonRarity();
    }, [])

    if (pokemonMaxCp == undefined && buddyDistance == undefined && candyEvolve == undefined && pokemonRarity == undefined) {
        return <p className="p-1 text-xs sm:text-sm text-center">Ce pokémon n&apos;est pas présent dans pokémon GO</p>
    }

    // bg-[#fb940a]

    const rarityColor = getRarityColor(pokemonRarity);

    return (
        <div className='flex flex-col gap-2 m-1'>
            {pokemonRarity != undefined ?
                <div className={`flex items-center justify-center w-full h-10 rounded-md ${rarityColor} outline outline-1 outline-black`}>
                    <p className='font-extrabold text-lg sm:text-xl'>{pokemonRarity.rarity}</p>
                </div>
                : null
            }
            <Card className="rounded-md border border-slate-500">
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
                                <td className="text-red-400 p-2 text-right font-medium">Max PC:</td>
                                <td className="p-2">{pokemonMaxCp != undefined ? <span className="font-bold">{pokemonMaxCp.max_cp}</span> : "Inconnu"}</td>
                            </tr>
                            <tr className="border-b border-slate-500">
                                <td className="text-red-400 p-2 text-right font-medium">Distance copain:</td>
                                <td className="p-2">{buddyDistance != undefined ? <span className="font-bold">{buddyDistance?.distance} km</span> : "Inconnu"}</td>
                            </tr>
                            <tr>
                                <td className="text-red-400 p-2 text-right font-medium">Nombre de bonbon pour évoluer:</td>
                                <td className="p-2">
                                    {
                                        candyEvolve != undefined ?
                                            <div className="flex flex-row gap-1.5 items-center">
                                                <p className="font-bold">
                                                    {candyEvolve?.candy_required}
                                                </p>
                                                <div className={`relative size-5 sm:size-6`}>
                                                    <Image
                                                        src={"/Sprite_Super_Bonbon_GO.png"}
                                                        alt={"Candy"}
                                                        fill
                                                        className="rounded-full object-cover"
                                                        unoptimized
                                                    />
                                                </div>
                                            </div>
                                            : "Ce pokémon n'évolue pas"
                                    }
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    )
}