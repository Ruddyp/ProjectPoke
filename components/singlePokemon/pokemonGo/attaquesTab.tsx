'use client'

import { PoGoApiCurrentPokemonMoves, PoGoApiPvpMoves, PokeApiMove, PokeApiMoves, Pokemon } from "@/app/type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

type AttaquesTabProps = {
    pokemon: Pokemon;
}

function getCurrentPokemonMoves(pokemonId: number, currentPokemonMovesList: PoGoApiCurrentPokemonMoves[]) {

    //On cherche en prio la forme normal ensuite on cherche une autre form
    const normalForm = currentPokemonMovesList.find((pokemon) => pokemon.pokemon_id == pokemonId && pokemon.form == "Normal");
    if (normalForm != undefined) return normalForm;
    return currentPokemonMovesList.find((pokemon) => pokemon.pokemon_id == pokemonId);
}

export default function AttaquesTab({ pokemon }: AttaquesTabProps) {
    const [pvpFastMoves, setPvpFastMoves] = useState<PoGoApiPvpMoves[] | undefined>(undefined)
    const [pvpChargedMoves, setPvpChargedMoves] = useState<PoGoApiPvpMoves[] | undefined>(undefined)
    const [pokemonMoves, setPokemonMoves] = useState<PoGoApiCurrentPokemonMoves | undefined>(undefined)
    const [movesInfo, setMovesInfo] = useState<PokeApiMoves | undefined>(undefined)
    console.log("pvpFastMoves", pvpFastMoves);
    console.log("pvpChargedMoves", pvpChargedMoves);
    console.log("pokemonMoves", pokemonMoves);
    console.log("movesInfo", movesInfo);

    useEffect(() => {
        async function getPoGoApiPvpFastMoves() {
            const url = `https://pogoapi.net/api/v1/pvp_fast_moves.json`
            const response = await fetch(url, {
                method: 'GET',
            });
            const pvpFastMoves: PoGoApiPvpMoves[] = await response.json();
            setPvpFastMoves(pvpFastMoves);
        }

        async function getPoGoApiPvpChargedMoves() {
            const url = `https://pogoapi.net/api/v1/pvp_charged_moves.json`
            const response = await fetch(url, {
                method: 'GET',
            });
            const pvpChargedMoves: PoGoApiPvpMoves[] = await response.json();
            setPvpChargedMoves(pvpChargedMoves);
        }

        async function getPoGoApiCurrentPokemonMoves() {
            const url = `https://pogoapi.net/api/v1/current_pokemon_moves.json`
            const response = await fetch(url, {
                method: 'GET',
            });
            const currentPokemonMovesList: PoGoApiCurrentPokemonMoves[] = await response.json();
            const pokemonMoves = getCurrentPokemonMoves(pokemon.pokedex_id, currentPokemonMovesList);
            setPokemonMoves(pokemonMoves);
        }

        getPoGoApiPvpFastMoves();
        getPoGoApiPvpChargedMoves();
        getPoGoApiCurrentPokemonMoves();
    }, [])

    useEffect(() => {
        async function getPokeApiMove(move: string) {
            const formattedMove = move.toLowerCase().replace(/\s+/g, '-');
            const url = `https://pokeapi.co/api/v2/move/${formattedMove}`
            const response = await fetch(url, {
                method: 'GET',
            });
            const moveInfo: PokeApiMove = await response.json();
            setMovesInfo(prevMovesInfo => ({
                ...prevMovesInfo,
                [move]: moveInfo
            }));
        }

        if (pokemonMoves) {
            for (let index = 0; index < pokemonMoves.fast_moves.length; index++) {
                getPokeApiMove(pokemonMoves.fast_moves[index]);
            }
            for (let index = 0; index < pokemonMoves.elite_fast_moves.length; index++) {
                getPokeApiMove(pokemonMoves.elite_fast_moves[index]);
            }
            for (let index = 0; index < pokemonMoves.charged_moves.length; index++) {
                getPokeApiMove(pokemonMoves.charged_moves[index]);
            }
            for (let index = 0; index < pokemonMoves.elite_charged_moves.length; index++) {
                getPokeApiMove(pokemonMoves.elite_charged_moves[index]);
            }
        }

    }, [pokemonMoves])

    if (pokemonMoves == undefined && pvpFastMoves == undefined && pvpChargedMoves == undefined && movesInfo == undefined) {
        return <p className="p-1 text-xs sm:text-sm text-center">Ce pokémon n&apos;est pas présent dans pokémon GO</p>
    }

    return (
        <div className="flex flex-col items-start justify-center gap-1">
            <Card className="m-0.5 rounded-md border border-slate-500 w-full">
                <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                    <CardTitle className="text-sm sm:text-base">
                        Attaques rapides
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-1 text-xs sm:text-sm">
                    {movesInfo != undefined && pokemonMoves?.fast_moves.map((move) => {
                        const moveInfo = pvpFastMoves?.find((fastMove) => fastMove.name == move)
                        const frInfo = movesInfo[move]?.names.find((element) => element.language.name == "fr")
                        if (moveInfo == undefined) {
                            return <>
                                <div key={`${pokemon.pokedex_id}-${move}`}>
                                    <p>{frInfo?.name}</p>
                                </div>
                            </>
                        }
                        return (<>
                            <div key={`${pokemon.pokedex_id}-${move}`} className="flex flex-row gap-1">
                                <p>{frInfo?.name}</p>
                                <p>DPS: {moveInfo?.power / moveInfo?.turn_duration}</p>
                                <p>EPS: {moveInfo?.energy_delta / moveInfo?.turn_duration}</p>
                                <p>Type: {moveInfo?.type}</p>
                            </div>
                        </>)
                    })}
                </CardContent>
            </Card>

            <Card className="m-0.5 rounded-md border border-slate-500 w-full">
                <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                    <CardTitle className="text-sm sm:text-base">
                        Attaques chargées
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-1 text-xs sm:text-sm">
                    {movesInfo != undefined && pokemonMoves?.charged_moves.map((move) => {
                        const moveInfo = pvpChargedMoves?.find((chargedMove) => chargedMove.name == move)
                        const frInfo = movesInfo[move]?.names.find((element) => element.language.name == "fr")
                        if (moveInfo == undefined) {
                            return <>
                                <div key={`${pokemon.pokedex_id}-${move}`}>
                                    <p>{frInfo?.name}</p>
                                </div>
                            </>
                        }
                        return (<>
                            <div key={`${pokemon.pokedex_id}-${move}`} className="flex flex-row gap-1">
                                <p>{frInfo?.name}</p>
                                <p>Puissance: {moveInfo?.power}</p>
                                <p>Energie: {moveInfo?.energy_delta}</p>
                                <p>Type: {moveInfo?.type}</p>
                            </div>
                        </>)
                    })}
                </CardContent>
            </Card>
        </div>
    )
}