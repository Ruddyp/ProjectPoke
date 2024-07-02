'use client'

import { PoGoApiCurrentPokemonMoves, PoGoApiPvpMoves, PokeApiMoves, Types } from "@/app/type"
import PvpFastMovesRows from "./pvpFastMovesRows";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type PvpFastMovesTableProps = {
    pokemonGoPvpFastMoves: PoGoApiPvpMoves[];
    pokemonMoves: PoGoApiCurrentPokemonMoves;
    movesInfo: PokeApiMoves;
    types: Types[]
}

export default function PvpFastMovesTable({ pokemonGoPvpFastMoves, pokemonMoves, movesInfo, types }: PvpFastMovesTableProps) {
    const { fast_moves, elite_fast_moves } = pokemonMoves;

    const allFastMoves = fast_moves.concat(elite_fast_moves);
    return (
        <table className="w-full table-auto">
            <thead>
                <tr className="border-b border-slate-500">
                    <th>Nom</th>
                    <th>
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger>
                                    DPS
                                </TooltipTrigger>
                                <TooltipContent sideOffset={10}>
                                    <p>Dégats par seconde</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </th>
                    <th>
                        <TooltipProvider delayDuration={200}>
                            <Tooltip>
                                <TooltipTrigger>
                                    EPS
                                </TooltipTrigger>
                                <TooltipContent sideOffset={10}>
                                    <p>Energies par seconde</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </th>
                    <th>Type</th>
                </tr>
            </thead>
            <tbody>
                <PvpFastMovesRows
                    allFastMoves={allFastMoves}
                    pokemonGoPvpFastMoves={pokemonGoPvpFastMoves}
                    movesInfo={movesInfo}
                    types={types}
                    eliteFastMoves={elite_fast_moves}
                />
            </tbody>
        </table>
    )
}