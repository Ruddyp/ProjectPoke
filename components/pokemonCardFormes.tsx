'use client'

import { Pokemon } from "@/app/type"
import { Dispatch, SetStateAction } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

type PokemonCardFormesProps = {
    pokemon: Pokemon
    setSrcSprite: Dispatch<SetStateAction<{ img: string; text: string; }>>
}

export default function PokemonCardFormes({ pokemon, setSrcSprite }: PokemonCardFormesProps) {
    const { sprites } = pokemon;
    const normal = sprites.regular
    const shiny = sprites.shiny;
    const gmaxNormal = sprites.gmax?.regular;
    const gmaxShiny = sprites.gmax?.shiny;

    return (
        <>
            <Card className="m-0.5 rounded-md">
                <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0">
                    <CardTitle className="text-sm sm:text-base">
                        Liste des formes
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                    <div className="flex flex-row gap-1 items-center justify-center flex-wrap">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-6 text-xs sm:text-sm"
                            onClick={() => setSrcSprite({ img: normal, text: "normal" })}
                        >
                            Normal
                        </Button>
                        {shiny != null ?
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-6 text-xs sm:text-sm data-[state=active]:text-white"
                                onClick={() => setSrcSprite({ img: shiny, text: "shiny" })}
                            >
                                Shiny
                            </Button>
                            : null
                        }
                        {gmaxNormal != null ?
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-6 text-xs sm:text-sm"
                                onClick={() => setSrcSprite({ img: gmaxNormal, text: "Gigamax normal" })}
                            >
                                Gmax normal
                            </Button>
                            : null
                        }
                        {gmaxShiny != null ?
                            <Button
                                variant="secondary"
                                size="sm"
                                className="h-6 text-xs sm:text-sm"
                                onClick={() => setSrcSprite({ img: gmaxShiny, text: "Gigamax shiny" })}
                            >
                                Gmax shiny
                            </Button>
                            : null
                        }
                    </div>
                </CardContent>
            </Card>
        </>
    )
}