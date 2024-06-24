'use client'

import PokemonCard from "@/components/pokemonCard"
import { Pokemon, Types } from "../type"

type FrontPageProps = {
  pokemons: Pokemon[]
  types: Types[]
}

export default function FrontPage({ pokemons, types }: FrontPageProps) {
  console.log("pokemons", pokemons)
  console.log("types", types)
  return (
    <>
      <div className="flex flex-wrap w-full p-8 gap-8 items-center justify-center">
        {pokemons.map((pokemon: Pokemon) =>
          <div key={pokemon.pokedex_id}>
            <PokemonCard pokemon={pokemon} types={types} />
          </div>
        )}
      </div>
    </>
  )
}