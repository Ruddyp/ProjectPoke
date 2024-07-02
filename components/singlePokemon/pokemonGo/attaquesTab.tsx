'use client'

import { PoGoApiCurrentPokemonMoves, PoGoApiPvpMoves, PokeApiMove, PokeApiMoves, Pokemon, Types } from "@/app/type"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import PvpFastMovesTable from "./attaqueComponents/pvpFastMovesTable";
import PvpChargedMovesTable from "./attaqueComponents/pvpChargedMovesTable";

type AttaquesTabProps = {
    pokemon: Pokemon;
    types: Types[]
}

function getCurrentPokemonMoves(pokemonId: number, currentPokemonMovesList: PoGoApiCurrentPokemonMoves[]) {

    //On cherche en prio la forme normal ensuite on cherche une autre form
    const normalForm = currentPokemonMovesList.find((pokemon) => pokemon.pokemon_id == pokemonId && pokemon.form == "Normal");
    if (normalForm != undefined) return normalForm;
    return currentPokemonMovesList.find((pokemon) => pokemon.pokemon_id == pokemonId);
}

export default function AttaquesTab({ pokemon, types }: AttaquesTabProps) {
    const [pokemonGoPvpFastMoves, setPokemonGoPvpFastMoves] = useState<PoGoApiPvpMoves[] | undefined>(undefined)
    const [pokemonGoPvpChargedMoves, setPokemonGoPvpChargedMoves] = useState<PoGoApiPvpMoves[] | undefined>(undefined)
    const [pokemonMoves, setPokemonMoves] = useState<PoGoApiCurrentPokemonMoves | undefined>(undefined)
    const [movesInfo, setMovesInfo] = useState<PokeApiMoves | undefined>(undefined)

    useEffect(() => {
        async function getPoGoApiPvpFastMoves() {
            const url = `https://pogoapi.net/api/v1/pvp_fast_moves.json`
            const response = await fetch(url, {
                method: 'GET',
            });
            const pvpFastMoves: PoGoApiPvpMoves[] = await response.json();
            setPokemonGoPvpFastMoves(pvpFastMoves);
        }

        async function getPoGoApiPvpChargedMoves() {
            const url = `https://pogoapi.net/api/v1/pvp_charged_moves.json`
            const response = await fetch(url, {
                method: 'GET',
            });
            const pvpChargedMoves: PoGoApiPvpMoves[] = await response.json();
            setPokemonGoPvpChargedMoves(pvpChargedMoves);
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

    if (pokemonGoPvpFastMoves == undefined || pokemonGoPvpChargedMoves == undefined) {
        return <p className="p-1 text-xs sm:text-sm text-center">Impossible de récupérer la liste des attaques dans pokémon GO</p>
    }

    if (movesInfo == undefined) {
        return <p className="p-1 text-xs sm:text-sm text-center">Impossible de récupérer les informations des attaques du pokémon.</p>
    }

    if (pokemonMoves == undefined) {
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
                    <PvpFastMovesTable
                        pokemonGoPvpFastMoves={pokemonGoPvpFastMoves}
                        pokemonMoves={pokemonMoves}
                        movesInfo={movesInfo}
                        types={types}
                    />
                </CardContent>
            </Card>
            <Card className="m-0.5 rounded-md border border-slate-500 w-full">
                <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                    <CardTitle className="text-sm sm:text-base">
                        Attaques chargées
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-1 text-xs sm:text-sm">
                    <PvpChargedMovesTable
                        pokemonGoPvpChargedMoves={pokemonGoPvpChargedMoves}
                        pokemonMoves={pokemonMoves}
                        movesInfo={movesInfo}
                        types={types}
                    />
                </CardContent>
            </Card>
        </div>
    )
}