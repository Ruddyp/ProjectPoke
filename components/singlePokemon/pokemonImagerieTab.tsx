'use client'

import { Pokemon } from "@/app/type";
import PokemonFoilImg from "../generic/pokemonFoilImg";

type PokemonImagerieTabProps = {
    pokemon: Pokemon;
}

function getImagesInfo(pokemon: Pokemon) {
    const { sprites } = pokemon;
    const imagesInfo: { img: string, text: string }[] = [];
    const normal = sprites.regular
    const shiny = sprites.shiny;
    const gmaxNormal = sprites.gmax?.regular;
    const gmaxShiny = sprites.gmax?.shiny;

    imagesInfo.push({ img: normal, text: "Normal" })
    if (shiny != null) imagesInfo.push({ img: shiny, text: "Shiny" })
    if (gmaxNormal != null) imagesInfo.push({ img: gmaxNormal, text: "Gmax normal" })
    if (gmaxShiny != null) imagesInfo.push({ img: gmaxShiny, text: "Gmax shiny" })

    if (pokemon.evolution != null && pokemon.evolution.mega != null) {
        pokemon.evolution.mega.forEach(megaEvol => {
            imagesInfo.push({ img: megaEvol.sprites.regular, text: `${megaEvol.orbe} normal` })
            if (megaEvol.sprites.shiny != null) {
                imagesInfo.push({ img: megaEvol.sprites.shiny, text: `${megaEvol.orbe} shiny` })
            }
        });
    }
    return imagesInfo
}

export default function PokemonImagerieTab({ pokemon }: PokemonImagerieTabProps) {
    const imagesInfo = getImagesInfo(pokemon);

    return (
        <div className="flex flex-row flex-wrap gap-8 items-center justify-center">
            {imagesInfo.map((image, index: number) => {
                return (
                    <div key={`${pokemon.pokedex_id}_image_${index}`}>
                        <PokemonFoilImg image={image} indexCard={index} />
                    </div>)
            })}
        </div>
    )
}