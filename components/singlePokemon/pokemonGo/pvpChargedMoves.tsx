'use client'

import { PoGoApiCurrentPokemonMoves, PoGoApiPvpMoves, PokeApiMoves, Pokemon, PokemonColorType, Types } from "@/app/type"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { colors } from "@/lib/utils";
import Image from 'next/image'

type PvpChargedMovesProps = {
    pokemon: Pokemon;
    pokemonGoPvpChargedMoves: PoGoApiPvpMoves[];
    pokemonMoves: PoGoApiCurrentPokemonMoves;
    movesInfo: PokeApiMoves;
    types: Types[]
}

type RowChargedMoveProps = {
    movesInfo: PokeApiMoves;
    pokemonGoPvpChargedMoves: PoGoApiPvpMoves[];
    move: string;
    types: Types[];
    isElite: boolean
}

function RowChargedMove({ pokemonGoPvpChargedMoves, movesInfo, move, types, isElite }: RowChargedMoveProps) {
    const moveInfo = pokemonGoPvpChargedMoves.find((chargedMove) => chargedMove.name == move);
    const frInfo = movesInfo[move]?.names.find((element) => element.language.name == "fr");
    const typeInfo = types.find(type => type.name.en.toLowerCase() == movesInfo[move]?.type.name.toLowerCase())

    if (moveInfo == undefined || typeInfo == undefined) {
        return null
    }

    return (
        <>
            <td className="text-center font-bold">
                <div className="flex flex-col sm:flex-row justify-center items-center">

                    <p>{frInfo != undefined ? frInfo.name : move}</p>
                    {isElite ?
                        <span className="bg-[#8da8fb] font-bold text-white ml-1 sm:ml-2 py-0.5 px-2 rounded-lg">Elite TM</span>
                        : null
                    }
                </div>
            </td>
            <td className="text-center"><p>{Math.round((moveInfo.power / moveInfo.turn_duration) * 100) / 100}</p></td>
            <td className="text-center"><p>{Math.round((moveInfo.energy_delta / moveInfo.turn_duration) * 100) / 100}</p></td>
            <td className="text-center p-1">
                <div className="flex justify-center">
                    <div key={`${move}_type`} className="relative size-5 sm:size-7">
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Image
                                        src={typeInfo.sprites}
                                        alt={typeInfo.name.fr}
                                        fill
                                        sizes="(max-width: 640px) 32px, 48px"
                                        className="border-2 border-slate-200 rounded-full object-cover"
                                        unoptimized
                                    />
                                </TooltipTrigger>
                                <TooltipContent sideOffset={10}>
                                    <p>{typeInfo.name.fr ?? moveInfo.type}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </td>

        </>
    )
}


export default function PvpChargedMoves({ pokemon, pokemonGoPvpChargedMoves, pokemonMoves, movesInfo, types }: PvpChargedMovesProps) {

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
                {pokemonMoves.charged_moves.map((move, index) => {
                    let border = "border-b border-slate-500"
                    if (pokemonMoves.charged_moves.length - 1 == index && pokemonMoves.elite_charged_moves.length == 0) {
                        border = ""
                    }
                    const typeInfo = types.find(type => type.name.en.toLowerCase() == movesInfo[move]?.type.name.toLowerCase())
                    const bgColor = colors[typeInfo?.name.fr.toLowerCase() as PokemonColorType];
                    return (
                        <tr key={`${pokemon.pokedex_id}-${move}`} className={`${border}`} style={{ backgroundColor: `${bgColor}50` }}>
                            <RowChargedMove
                                pokemonGoPvpChargedMoves={pokemonGoPvpChargedMoves}
                                movesInfo={movesInfo}
                                move={move}
                                types={types}
                                isElite={false}
                            />
                        </tr>
                    )
                })}
                {pokemonMoves.elite_charged_moves.map((move, index) => {
                    let border = "border-b border-slate-500"
                    if (pokemonMoves.elite_charged_moves.length - 1 == index) {
                        border = ""
                    }
                    const typeInfo = types.find(type => type.name.en.toLowerCase() == movesInfo[move]?.type.name.toLowerCase())
                    const bgColor = colors[typeInfo?.name.fr.toLowerCase() as PokemonColorType];
                    return (
                        <tr key={`${pokemon.pokedex_id}-${move}`} className={`${border}`} style={{ backgroundColor: `${bgColor}50` }}>
                            <RowChargedMove
                                pokemonGoPvpChargedMoves={pokemonGoPvpChargedMoves}
                                movesInfo={movesInfo}
                                move={move}
                                types={types}
                                isElite
                            />
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}