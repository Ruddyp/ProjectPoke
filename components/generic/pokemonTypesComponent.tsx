'use client'

import Image from 'next/image'
import { Pokemon, PokemonTypes } from '@/app/type'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'

type PokemonTypesComponentProps = {
    pokemon: Pokemon;
}

export default function PokemonTypesComponent({ pokemon }: PokemonTypesComponentProps) {
    return (
        <div className="flex flex-row justify-center items-center gap-2">
            {pokemon.types != null ?
                pokemon.types.map((type: PokemonTypes, index: number) => {
                    return (
                        <div className="flex flex-row justify-center items-center gap-2" key={`${pokemon.pokedex_id}_type_${index}`}>
                            <TooltipProvider delayDuration={200}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Image
                                            src={type.image}
                                            alt={type.name}
                                            width={32}
                                            height={32}
                                            quality={75}
                                            className="border-2 border-slate-200 rounded-full size-6 sm:size-8"
                                            unoptimized
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent sideOffset={10}>
                                        <p>{type.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>)
                })
                : <p>Ce pokémon n&apos;a pas de type</p>
            }
        </div>
    )
}