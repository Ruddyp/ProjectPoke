'use client'

import { Pokemon } from "@/app/type"
import PokemonTabs from "@/components/singlePokemon/pokemonTabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from 'next/navigation'

type FrontPageProps = {
  pokemon: Pokemon
}


export default function FrontPage({ pokemon }: FrontPageProps) {
  const router = useRouter();
  const previousId = pokemon.pokedex_id - 1;
  const nextId = pokemon.pokedex_id + 1;

  return (
    <div className="flex flex-col items-center justify-center gap-6 m-10">
      <div className="flex flex-row gap-4 items-center justify-around">
        <Button
          variant="default"
          size="default_responsive"
          onClick={() => router.push(`/pokemon/${previousId}`)}
          disabled={previousId <= 0 ? true : false}
        >
          {/* <span>{"<--"}</span><span className="hidden sm:flex ml-0.5">Précédent</span> */}
          <ChevronLeft className="h-5 w-5" strokeWidth={3} />
          <span className="hidden sm:flex">Précédent</span>
        </Button>
        <span className="text-red-400 font-bold text-4xl">{pokemon.name.fr}</span>
        <Button
          variant="default"
          size="default_responsive"
          onClick={() => router.push(`/pokemon/${nextId}`)}
          disabled={previousId >= 1025 ? true : false}
        >
          {/* <span className="hidden sm:flex mr-0.5">Suivant</span><span>{"-->"}</span> */}
          <span className="hidden sm:flex">Suivant</span>
          <ChevronRight className="h-5 w-5" strokeWidth={3} />
        </Button>
      </div>
      <PokemonTabs pokemon={pokemon} />
    </div>
  )
}