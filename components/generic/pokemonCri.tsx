'use client'

import { PokeApiPokemon } from '@/app/type'
import { Play } from 'lucide-react'
import { useRef } from 'react'

type PokemonCriProps = {
    pokeApiPokemon: PokeApiPokemon | undefined;
}

export default function PokemonCri({ pokeApiPokemon }: PokemonCriProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const handlePlay = () => {
        if (audioRef.current) {
            audioRef.current.volume = 0.2;
            audioRef.current.play();
        }
    };

    return (
        <>
            {pokeApiPokemon != undefined ?
                <div onClick={handlePlay} className="flex items-center justify-center w-10 bg-accent border-2 border-white rounded-full cursor-pointer p-1 hover:bg-primary">
                    <Play fill="white" color="white" className="rounded-full" />
                    <audio
                        ref={audioRef}
                        className="hidden"
                        controls
                        src={pokeApiPokemon.cries.latest}
                    ></audio>
                </div>
                : "Aucun cri disponible"
            }
        </>
    )
}