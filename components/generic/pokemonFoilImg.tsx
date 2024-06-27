'use client'

import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { GlareCard } from '../ui/glare-card'

type PokemonFoilImgProps = {
    image: {
        img: string
        text: string
    },
    indexCard: number
}

export default function PokemonFoilImg({ image, indexCard }: PokemonFoilImgProps) {

    return (
        <>
            <Card className="flex flex-col items-center justify-center rounded-lg border border-slate-500 size-72 sm:size-80">
                <CardHeader className="flex flex-row text-nowrap w-full h-full items-center justify-center bg-muted/80 m-0 p-0 rounded-t-lg">
                    <CardTitle className="text-xs sm:text-sm">
                        {image.text}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center relative p-1 max-w-72 sm:max-w-80">
                    <div className='flex size-56 xs:size-64 sm:hidden'>
                        <Image
                            src={image.img}
                            alt={image.text}
                            fill
                            className="object-cover p-2"
                            sizes="(max-width: 640px) 224px, 256px"
                            priority={(indexCard >= 0 && indexCard < 4) ? true : false}
                            unoptimized
                        />
                    </div>
                    <div className='hidden sm:flex'>
                        <GlareCard className="bg-accent/50">
                            <Image
                                src={image.img}
                                alt={image.text}
                                fill
                                className="object-cover p-2"
                                sizes="(max-width: 640px) 224px, 256px"
                                priority={(indexCard >= 0 && indexCard < 4) ? true : false}
                                unoptimized
                            />
                        </GlareCard>
                    </div>
                </CardContent>
            </Card>

        </>
    )
}