'use client'

import { PoGoApiPvpMoves, PokeApiMoves, PokemonColorType, Types } from "@/app/type"
import { colors } from "@/lib/utils";
import PvpChargedMoveRow from "./pvpChargedMoveRow";

type PvpChargedMovesRowsProps = {
    allChargedMoves: string[];
    pokemonGoPvpChargedMoves: PoGoApiPvpMoves[];
    movesInfo: PokeApiMoves;
    eliteChargedMoves: string[];
    types: Types[];
}

function isLastMove(movesLenght: number, index: number) {
    if (movesLenght - 1 == index) return true
    return false
}

export default function PvpChargedMovesRows({ pokemonGoPvpChargedMoves, allChargedMoves, movesInfo, eliteChargedMoves, types }: PvpChargedMovesRowsProps) {

    return (
        <>
            {allChargedMoves.map((move, index) => {
                const typeInfo = types.find(type => type.name.en.toLowerCase() == movesInfo[move]?.type.name.toLowerCase())
                const bgColor = colors[typeInfo?.name.fr.toLowerCase() as PokemonColorType];
                return (
                    <tr key={`${index}-${move}`} className={`${isLastMove(allChargedMoves.length, index) ? "border-0" : "border-b border-slate-500"}`} style={{ backgroundColor: `${bgColor}50` }}>
                        <PvpChargedMoveRow
                            pokemonGoPvpChargedMoves={pokemonGoPvpChargedMoves}
                            movesInfo={movesInfo}
                            move={move}
                            types={types}
                            isElite={eliteChargedMoves.includes(move) ? true : false}
                        />
                    </tr>
                )
            })}
        </>
    )
}