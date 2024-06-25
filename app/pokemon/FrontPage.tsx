'use client'

import { Pokemon, Types } from "../type"
import SearchBar from "@/components/searchBar"
import { useState } from "react"
import TypeFilter, { TypeFilterType, typeFilterDefaultValue } from "@/components/typeFilter"
import PokemonCard from "@/components/card/pokemonCard"

type FrontPageProps = {
  pokemons: Pokemon[]
  types: Types[]
}

function getFilteredPokemon(pokemons: Pokemon[], searchValue: string) {
  if (searchValue == "") return pokemons;
  return pokemons.filter((pokemon) => pokemon.name.fr.toLowerCase().includes(searchValue));
}

function getFilteredPokemonByType(pokemons: Pokemon[], typeFilter: TypeFilterType) {
  const activeTypes: string[] = []
  for (const [key, value] of Object.entries(typeFilter)) {
    if (value == true) {
      activeTypes.push(key)
    }
  }
  if (activeTypes.length === 0) return pokemons;

  return pokemons.filter((pokemon) => {
    const pokemonTypes = pokemon.types.map(type => type.name.toLowerCase());
    // Vérifier que tous les types actifs sont présents dans les types du Pokémon
    return activeTypes.every(type => pokemonTypes.includes(type));
  });
}

export default function FrontPage({ pokemons, types }: FrontPageProps) {
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState(typeFilterDefaultValue);
  let filteredPokemons = getFilteredPokemon(pokemons, searchValue);
  if (typeFilter != typeFilterDefaultValue) {
    filteredPokemons = getFilteredPokemonByType(filteredPokemons, typeFilter);
  }

  return (
    <>
      <div className="flex flex-col flex-wrap w-full p-8 gap-2 items-center justify-center">
        <SearchBar onChange={setSearchValue} value={searchValue} />
        <TypeFilter types={types} setTypeFilter={setTypeFilter} typeFilter={typeFilter} />
        <div className="flex flex-row w-full gap-2 items-center justify-center">
          <span className="text-base font-medium">Nombre de pokémon:</span>
          <span className="text-lg font-extrabold text-white">{filteredPokemons.length}</span>
        </div>
        <div className="flex flex-row flex-wrap items-center justify-center w-full gap-8 mt-4">
          {filteredPokemons.map((pokemon: Pokemon) =>
            <div key={pokemon.pokedex_id}>
              <PokemonCard pokemon={pokemon} types={types} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}