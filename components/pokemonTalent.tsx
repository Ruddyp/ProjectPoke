'use client'

import { Pokemon, PokemonTalents } from "@/app/type"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type PokemonTalentsProps = {
    pokemon: Pokemon;
}

export default function PokemonTalent({ pokemon }: PokemonTalentsProps) {
    const { talents } = pokemon;
    return (
        <>
            {talents == null || talents.length == 0 ? "Ce pokémon ne possède aucun talents" : null}
            <Card className="m-0.5 rounded-md">
                <CardHeader className="flex flex-row text-nowrap items-center justify-center bg-muted/80 p-1 m-0">
                    <CardTitle className="text-sm sm:text-base">
                        Liste des talents
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-1 text-xs sm:text-sm">
                    <div className="flex flex-col gap-1">
                        {talents != null && talents.map((talent: PokemonTalents, index: number) => {
                            return (
                                <>
                                    <div key={`${pokemon.name.fr}_talent_${index}`} className="p-1 flex flex-row items-center">
                                        <p>{talent.name}</p>
                                        {talent.tc ? <span className="bg-[#ff7675] font-bold text-white ml-2 py-0.5 px-2 rounded-lg">Talent Caché</span> : null}
                                    </div>
                                </>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}