'use client'

import { Pokemon, Types } from "@/app/type"
import PokemonTabs from "@/components/singlePokemon/pokemonTabs"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from 'next/navigation'

type FrontPageProps = {
  pokemon: Pokemon;
  types: Types[];
}


export default function FrontPage({ pokemon, types }: FrontPageProps) {
  const router = useRouter();
  const previousId = pokemon.pokedex_id - 1;
  const nextId = pokemon.pokedex_id + 1;
  console.log("pokemon", pokemon);

  return (
    <div className="flex flex-col items-center justify-center gap-6 m-10">
      <div className="flex flex-row gap-4 items-center justify-around">
        <Button
          variant="default"
          size="default_responsive"
          onClick={() => router.push(`/pokemon/${previousId}`)}
          disabled={previousId < 0 ? true : false}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={3} />
          <span className="hidden sm:flex">Précédent</span>
        </Button>
        <span className="text-red-400 font-bold text-2xl sm:text-4xl">{pokemon.name.fr}</span>
        <Button
          variant="default"
          size="default_responsive"
          onClick={() => router.push(`/pokemon/${nextId}`)}
          disabled={previousId >= 1024 ? true : false}
        >
          <span className="hidden sm:flex">Suivant</span>
          <ChevronRight className="h-5 w-5" strokeWidth={3} />
        </Button>
      </div>
      <PokemonTabs pokemon={pokemon} types={types} />
    </div>
  )
}