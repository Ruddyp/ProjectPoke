'use client'

import { Pokemon, Types } from "../type"
import SearchBar from "@/components/searchBar"
import { useEffect, useState } from "react"
import TypeFilter, { TypeFilterType, typeFilterInitValue } from "@/components/typeFilter"
import PokemonCard from "@/components/card/pokemonCard"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

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
  if (typeFilter != typeFilterInitValue) {
    filteredPokemons = getFilteredPokemonByType(filteredPokemons, typeFilter);
  }
  return filteredPokemons
}

function getPagesForSelect(filteredPokemonsLength: number, rowsPerPage: number) {
  const nbPages = Math.ceil(filteredPokemonsLength / rowsPerPage)
  const pages: string[] = [];
  for (let index = 1; index < nbPages + 1; index++) {
    pages.push(`${index}`)
  }
  return pages
}

function getActiveTypeFilter(typeFilter: TypeFilterType) {
  return Object.entries(typeFilter)
    .filter(([key, value]) => value === true)
    .map(([key, value]) => key);
}

function getTypeFilterDefaultValue(activeTypes: string | null) {
  if (activeTypes == null) {
    return typeFilterInitValue
  }

  let typefilterDefaultValue = { ...typeFilterInitValue };
  activeTypes.split(',').forEach(type => {
    if (typefilterDefaultValue.hasOwnProperty(type)) {
      typefilterDefaultValue[type as keyof TypeFilterType] = true;
    }
  });
  return typefilterDefaultValue;

}

export default function FrontPage({ pokemons, types }: FrontPageProps) {
  const rowsPerPage = 20;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTypes = searchParams.get('types');
  const searchDefaultValue = searchParams.get('search') ?? "";
  const [searchValue, setSearchValue] = useState(searchDefaultValue);
  const [typeFilter, setTypeFilter] = useState(getTypeFilterDefaultValue(activeTypes));
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(rowsPerPage);
  const [selectValue, setSelectValue] = useState("1");

  useEffect(() => {
    const activeTypeFilters = getActiveTypeFilter(typeFilter);
    let activeTypeFilterString = ""
    for (let index = 0; index < activeTypeFilters.length; index++) {
      activeTypeFilterString += activeTypeFilters[index]
      if (index + 1 < activeTypeFilters.length) {
        activeTypeFilterString += ","
      }
    }

    if (activeTypeFilterString == "" && searchValue == "") {
      router.push(`${pathname}`);
    }

    if (activeTypeFilterString != "" && searchValue == "") {
      router.push(`${pathname}?types=${activeTypeFilterString}`);
    }

    if (activeTypeFilterString != "" && searchValue != "") {
      router.push(`${pathname}?search=${searchValue}&types=${activeTypeFilterString}`);
    }

    if (activeTypeFilterString == "" && searchValue != "") {
      router.push(`${pathname}?search=${searchValue}`);
    }
  }, [pathname, router, typeFilter, searchValue]);


  const filteredPokemons = getFilteredPokemon(pokemons, searchValue, typeFilter);
  const pages = getPagesForSelect(filteredPokemons.length, rowsPerPage);

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
          <span className="text-base font-medium">Nombre de pokémon :</span>
          <span className="text-lg font-extrabold text-white">{filteredPokemons.length}</span>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                size={"default_responsive"}
                className={startIndex === 0 ? "hidden" : "bg-primary text-primary-foreground hover:bg-primary/90 p-1"}
                onClick={(() => {
                  setStartIndex(startIndex - rowsPerPage);
                  setEndIndex(endIndex - rowsPerPage);
                  setSelectValue(startIndex == 0 ? "1" : ((startIndex / rowsPerPage)).toString())
                })}
              />
            </PaginationItem>
            <PaginationItem className="text-sm mx-0.5 p-1 sm:p-2 smmx-1 sm:text-base ">
              {
                filteredPokemons.length > 0
                  ?
                  <Select
                    value={selectValue}
                    onValueChange={(value: string) => {
                      const pageNumber = parseInt(value, 10);
                      setSelectValue(value)
                      setStartIndex((pageNumber - 1) * rowsPerPage);
                      setEndIndex((pageNumber * rowsPerPage) + rowsPerPage);
                    }}
                  >
                    <SelectTrigger className="flex flex-row gap-1 border-2 border-secondary/60 hover:border-secondary p-1 h-8">
                      Page {startIndex == 0 ? "1" : (startIndex / rowsPerPage) + 1} / {Math.ceil(filteredPokemons.length / rowsPerPage)}
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {pages.map((page: string, index: number) => {
                          return (
                            <div key={page}>
                              <SelectItem value={page}>
                                {page}
                              </SelectItem>
                            </div>
                          )
                        })
                        }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  : null
              }
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                size={"default_responsive"}
                className={((startIndex / rowsPerPage) + 1 >= pages.length) ? "hidden" : "bg-primary text-primary-foreground hover:bg-primary/90 p-1"}
                onClick={(() => {
                  setStartIndex(startIndex + rowsPerPage);
                  setEndIndex(endIndex + rowsPerPage);
                  setSelectValue(startIndex == 0 ? "2" : ((startIndex / rowsPerPage) + 2).toString())
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