'use client'

import { PoGoApiCurrentPokemonMoves, PoGoApiPvpMoves, PokeApiMoves, Types } from "@/app/type"
import PvpChargedMovesRows from "./pvpChargedMovesRows";

type PvpChargedMovesTableProps = {
    pokemonGoPvpChargedMoves: PoGoApiPvpMoves[];
    pokemonMoves: PoGoApiCurrentPokemonMoves;
    movesInfo: PokeApiMoves;
    types: Types[]
}

export default function PvpChargedMovesTable({ pokemonGoPvpChargedMoves, pokemonMoves, movesInfo, types }: PvpChargedMovesTableProps) {
    const { charged_moves, elite_charged_moves } = pokemonMoves;

    const allChargedMoves = charged_moves.concat(elite_charged_moves);
    return (
        <table className="w-full table-auto">
            <thead>
                <tr className="border-b border-slate-500">
                    <th>Nom</th>
                    <th>Power</th>
                    <th>Energie</th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                <PvpChargedMovesRows
                    allChargedMoves={allChargedMoves}
                    pokemonGoPvpChargedMoves={pokemonGoPvpChargedMoves}
                    movesInfo={movesInfo}
                    eliteChargedMoves={elite_charged_moves}
                    types={types}
                />
            </tbody>
        </table>
    )
}