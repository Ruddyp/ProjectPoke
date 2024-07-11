'use client'

import { useState } from "react";
import { Pokemon, Raid } from "../type";
import SearchBar from "@/components/searchBar";
import RaidCard, { getTierInfo } from "@/components/raid/raidCard";
import RaidFilter, { raidFilterInitValue, RaidFilterType } from "@/components/raid/raidFilter";

type FrontPageProps = {
  raids: Raid[] | undefined
  pokemons: Pokemon[]
}

function getFilteredRaidBySearch(pokemons: Pokemon[], raids: Raid[], searchValue: string) {
  if (searchValue == "") return raids;
  return raids.filter((raid) => {
    const pokemonInfo = pokemons.find(pokemon => pokemon.pokedex_id == raid.pokemon_id);
    if (pokemonInfo == undefined) return false
    return pokemonInfo.name.fr.toLowerCase().includes(searchValue)
  });
}

function getFilteredRaidByTier(raids: Raid[], raidFilter: RaidFilterType) {
  const activeRaids: string[] = []

  for (const [key, value] of Object.entries(raidFilter)) {
    if (value == true) {
      activeRaids.push(key)
    }
  }

  if (activeRaids.length === 0) return raids;

  return raids.filter((raid) => {
    const tierInfo = getTierInfo(raid.tier)
    if (raidFilter[tierInfo.filter as keyof RaidFilterType]) {
      return true
    }
    return false
  });
}

function getFilteredRaid(pokemons: Pokemon[], raids: Raid[], searchValue: string, raidFilter: RaidFilterType) {
  let filteredRaid = getFilteredRaidBySearch(pokemons, raids, searchValue);
  if (raidFilter != raidFilterInitValue) {
    filteredRaid = getFilteredRaidByTier(filteredRaid, raidFilter);
  }
  return filteredRaid
}

export default function FrontPage({ raids, pokemons }: FrontPageProps) {
  const [searchValue, setSearchValue] = useState("");
  const [raidFilter, setRaidFilter] = useState(raidFilterInitValue);

  if (raids == undefined) return <p>Erreur lors de la récupération de la liste des raids</p>

  const filteredRaids = getFilteredRaid(pokemons, raids, searchValue, raidFilter)

  return (
    <div className="flex flex-col flex-wrap w-full p-8 gap-3 items-center justify-center">
      <SearchBar onChange={setSearchValue} value={searchValue} />
      <RaidFilter raidFilter={raidFilter} setRaidFilter={setRaidFilter} />
      <div className="flex flex-row w-full gap-2 items-center justify-center">
        <span className="text-base font-medium">Nombre de raid :</span>
        <span className="text-lg font-extrabold text-white">{filteredRaids.length}</span>
      </div>
      <div className="flex flex-row w-full gap-2 items-center justify-center">
        <span className="text-lg font-extrabold text-white">{ }</span>
      </div>
      <div className="flex flex-row flex-wrap items-start justify-center w-full gap-6">
        {filteredRaids.map((raid: Raid, index: number) => {
          const pokemon = pokemons.find(poke => poke.pokedex_id == raid.pokemon_id)
          if (pokemon == undefined) return <p key={raid.pokemon_id}>Erreur lors de la récupération des information du pokemon</p>
          return (
            <div key={`${raid.pokemon_id}-${index}`}>
              <RaidCard pokemon={pokemon} raid={raid} />
            </div>
          )
        }
        )}
      </div>
    </div>
  )
}