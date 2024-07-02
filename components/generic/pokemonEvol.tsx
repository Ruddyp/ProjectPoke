'use client'

import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Evolution, Pokemon } from '@/app/type'
import { useRouter } from 'next/navigation'

type PokemonEvolProps = {
    pokemon: Pokemon;
    evol: Evolution;
}

export default function PokemonEvol({ pokemon, evol }: PokemonEvolProps) {
    const router = useRouter();

    const borderColor = evol.pokedex_id == pokemon.pokedex_id ? "border-[#ff7675]" : "border-slate-500";

    return (
        <Card className={`m-0.5 rounded-md border ${borderColor} w-72 sm:w-80`}>
            <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0 rounded-t-md">
                <CardTitle className="text-sm sm:text-base">
                    {evol.name}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-1 text-xs sm:text-sm text-center cursor-pointer">
                <div onClick={() => router.push(`/pokemon/${evol.pokedex_id}`)} className="relative size-48 xs:size-56 sm:size-64">
                    <Image
                        src={`https://raw.githubusercontent.com/Yarkis01/TyraDex/images/sprites/${evol.pokedex_id}/regular.png`}
                        alt={evol.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 475px) 192px, (max-width: 640px) 224px, 256px"
                        unoptimized
                    />
                </div>
            </CardContent>
            <CardFooter className='flex flex-row items-center justify-center bg-muted/80 p-1 m-0 rounded-b-md'>
                <CardTitle className='text-center text-sm sm:text-base'>
                    {evol.condition != "" ? evol.condition : <p>&nbsp;</p>}
                </CardTitle>
            </CardFooter>
        </Card>
    )
}