'use client'

import { PoGoApiPvpMoves, PokeApiMoves, Types } from "@/app/type"
import EliteBadge from "./eliteBadge";
import TypeImage from "./typeImage";

type PvpChargedMoveRowProps = {
    movesInfo: PokeApiMoves;
    pokemonGoPvpChargedMoves: PoGoApiPvpMoves[];
    move: string;
    types: Types[];
    isElite: boolean
}

export default function PvpChargedMoveRow({ movesInfo, pokemonGoPvpChargedMoves, move, types, isElite }: PvpChargedMoveRowProps) {
    const moveInfo = pokemonGoPvpChargedMoves.find((chargedMove) => chargedMove.name == move);
    const frInfo = movesInfo[move]?.names.find((element) => element.language.name == "fr");
    const typeInfo = types.find(type => type.name.en.toLowerCase() == movesInfo[move]?.type.name.toLowerCase())

    if (moveInfo == undefined || typeInfo == undefined) {
        return null
    }

    return (
        <>
            <td className="text-center font-bold">
                <div className="flex flex-col sm:flex-row justify-center items-center my-1 sm:my-0">
                    <p>{frInfo != undefined ? frInfo.name : move}</p>
                    {isElite ? <EliteBadge /> : null}
                </div>
            </td>
            <td className="text-center"><p>{Math.round((moveInfo.power / moveInfo.turn_duration) * 100) / 100}</p></td>
            <td className="text-center"><p>{Math.round((moveInfo.energy_delta / moveInfo.turn_duration) * 100) / 100}</p></td>
            <td className="text-center p-1">
                <div className="flex justify-center">
                    <div key={`${move}_type`} className="relative size-5 sm:size-7">
                        <TypeImage
                            src={typeInfo.sprites}
                            name={typeInfo.name.fr ?? moveInfo.type}
                        />
                    </div>
                </div>
            </td>
        </>
    )
}