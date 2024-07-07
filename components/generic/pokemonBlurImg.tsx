'use client'

import Image from 'next/image'
import { Pokemon } from '@/app/type'

type PokemonBlurImgProps = {
    pokemon: Pokemon
}

export default function PokemonBlurImg({ pokemon }: PokemonBlurImgProps) {

    return (
        <div className="flex items-center justify-center relative p-1 size-48 xs:size-56 sm:size-64">
            <Image
                src={pokemon.sprites.regular}
                alt={"Pokemon floutée"}
                fill
                className="object-cover blur-xl"
                sizes="(max-width: 475px) 192px, (max-width: 640px) 224px, 256px"
                unoptimized
            />
        </div>
    )
}