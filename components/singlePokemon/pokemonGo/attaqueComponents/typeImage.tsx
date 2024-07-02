'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from 'next/image'

type TypeImageProps = {
    src: string
    name: string
}

export default function TypeImage({ src, name }: TypeImageProps) {

    return (
        <TooltipProvider delayDuration={200}>
            <Tooltip>
                <TooltipTrigger>
                    <Image
                        src={src}
                        alt={name}
                        fill
                        sizes="(max-width: 640px) 32px, 48px"
                        className="border-2 border-slate-200 rounded-full object-cover"
                        unoptimized
                    />
                </TooltipTrigger>
                <TooltipContent sideOffset={10}>
                    <p>{name}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}