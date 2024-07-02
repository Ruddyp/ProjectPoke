'use client'

import { PoGoApiPvpMoves, PokeApiMoves, PokemonColorType, Types } from "@/app/type"
import { colors } from "@/lib/utils";
import PvpFastMoveRow from "./pvpFastMoveRow";

type PvpFastMovesRowsProps = {
    allFastMoves: string[]
    pokemonGoPvpFastMoves: PoGoApiPvpMoves[];
    movesInfo: PokeApiMoves;
    eliteFastMoves: string[]
    types: Types[]
}

function isLastMove(movesLenght: number, index: number) {
    if (movesLenght - 1 == index) return true
    return false
}

export default function PvpFastMovesRows({ pokemonGoPvpFastMoves, allFastMoves, movesInfo, eliteFastMoves, types }: PvpFastMovesRowsProps) {

    return (
        <>
            {allFastMoves.map((move, index) => {
                const typeInfo = types.find(type => type.name.en.toLowerCase() == movesInfo[move]?.type.name.toLowerCase())
                const bgColor = colors[typeInfo?.name.fr.toLowerCase() as PokemonColorType];
                return (
                    <tr key={`${index}-${move}`} className={`${isLastMove(allFastMoves.length, index) ? "border-0" : "border-b border-slate-500"}`} style={{ backgroundColor: `${bgColor}50` }}>
                        <PvpFastMoveRow
                            pokemonGoPvpFastMoves={pokemonGoPvpFastMoves}
                            movesInfo={movesInfo}
                            move={move}
                            types={types}
                            isElite={eliteFastMoves.includes(move) ? true : false}
                        />
                    </tr>
                )
            })}
        </>
    )
}