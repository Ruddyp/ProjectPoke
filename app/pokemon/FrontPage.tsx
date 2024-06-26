'use client'

import { Pokemon, Types } from "../type"
import SearchBar from "@/components/searchBar"
import { useEffect, useState } from "react"
import TypeFilter, { TypeFilterType, typeFilterDefaultValue } from "@/components/typeFilter"
import PokemonCard from "@/components/card/pokemonCard"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

type FrontPageProps = {
  pokemons: Pokemon[]
  types: Types[]
}

function getFilteredPokemonBySearch(pokemons: Pokemon[], searchValue: string) {
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
    // Gestion du cas missing no qui n'a pas de types
    if (pokemon.types == null || pokemon.types.length === 0) {
      return false;
    }
    const pokemonTypes = pokemon.types.map(type => type.name.toLowerCase());
    // Vérifier que tous les types actifs sont présents dans les types du Pokémon
    return activeTypes.every(type => pokemonTypes.includes(type));
  });
}

function getFilteredPokemon(pokemons: Pokemon[], searchValue: string, typeFilter: TypeFilterType) {
  let filteredPokemons = getFilteredPokemonBySearch(pokemons, searchValue);
  if (typeFilter != typeFilterDefaultValue) {
    filteredPokemons = getFilteredPokemonByType(filteredPokemons, typeFilter);
  }
  return filteredPokemons
}

export default function FrontPage({ pokemons, types }: FrontPageProps) {
  const rowsPerPage = 20;
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState(typeFilterDefaultValue);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(rowsPerPage);

  console.log({ startIndex })
  console.log({ endIndex })

  const filteredPokemons = getFilteredPokemon(pokemons, searchValue, typeFilter)

  console.log("pokemon", pokemons[0]);

  useEffect(() => {
    setStartIndex(0)
    setEndIndex(rowsPerPage)
  }, [searchValue, typeFilter])

  return (
    <>
      <div className="flex flex-col flex-wrap w-full p-8 gap-3 items-center justify-center">
        <SearchBar onChange={setSearchValue} value={searchValue} />
        <TypeFilter types={types} setTypeFilter={setTypeFilter} typeFilter={typeFilter} />
        <div className="flex flex-row w-full gap-2 items-center justify-center">
          <span className="text-base font-medium">Nombre de pokémon:</span>
          <span className="text-lg font-extrabold text-white">{filteredPokemons.length}</span>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                size={"default_responsive"}
                className={startIndex === 0 ? "hidden" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                onClick={(() => {
                  setStartIndex(startIndex - rowsPerPage);
                  setEndIndex(endIndex - rowsPerPage);
                })}
              />
            </PaginationItem>
            <PaginationItem className="text-sm mx-0.5 p-1 sm:p-2 smmx-1 sm:text-base ">
              {
                filteredPokemons.length > 0
                  ?
                  <>
                    Page {startIndex == 0 ? "1" : (startIndex / rowsPerPage) + 1} / {Math.ceil(filteredPokemons.length / rowsPerPage)}
                  </>
                  : null
              }
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                size={"default_responsive"}
                className={endIndex > filteredPokemons.length ? "hidden" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                onClick={(() => {
                  setStartIndex(startIndex + rowsPerPage);
                  setEndIndex(endIndex + rowsPerPage);
                })} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <div className="flex flex-row flex-wrap items-center justify-center w-full gap-8 mt-4">
          {filteredPokemons.slice(startIndex, endIndex).map((pokemon: Pokemon, index: number) =>
            <div key={pokemon.pokedex_id}>
              <PokemonCard pokemon={pokemon} types={types} indexCard={index} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}