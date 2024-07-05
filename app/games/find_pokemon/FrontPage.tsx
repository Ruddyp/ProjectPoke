'use client'

import { PokeApiPokemonSpecies, Pokemon, PokemonTypes, Types } from "@/app/type"
import ComponentIndice from "@/components/games/findPokemon/componentIndice"
import TextIndice from "@/components/games/findPokemon/textIndice"
import PokemonGenderStats from "@/components/generic/pokemonGenderStats"
import PokemonResistances from "@/components/generic/pokemonResistances"
import PokemonTalent from "@/components/generic/pokemonTalent"
import SearchBar from "@/components/searchBar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import Image from 'next/image'


type FrontPageProps = {
  pokemon: Pokemon
  types: Types[]
  pokemonDescription: PokeApiPokemonSpecies
}

type PokemonTypesComponentProps = {
  pokemon: Pokemon
}

function PokemonTypesComponent({ pokemon }: PokemonTypesComponentProps) {
  return (
    <div className="flex flex-row justify-center items-center gap-4">
      {pokemon.types != null ?
        pokemon.types.map((type: PokemonTypes, index: number) => {
          return (
            <div key={`${pokemon.pokedex_id}_type_${index}`}>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <Image
                      src={type.image}
                      alt={type.name}
                      width={32}
                      height={32}
                      quality={75}
                      className="border-2 border-slate-200 rounded-full size-6 sm:size-8"
                      unoptimized
                    />
                  </TooltipTrigger>
                  <TooltipContent sideOffset={10}>
                    <p>{type.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>)
        })
        : <p>Ce pokémon n&apos;a pas de type</p>
      }
    </div>
  )
}

function getIndices(pokemon: Pokemon, types: Types[], pokemonDescription: PokeApiPokemonSpecies) {
  const indices = []
  indices.push(<ComponentIndice title="Répartition des sexes" component={<PokemonGenderStats sexe={pokemon.sexe} />} />)
  if (pokemon.weight != null) {
    indices.push(<TextIndice title="Poids" text={pokemon.weight} />)
  }
  if (pokemon.height != null) {
    indices.push(<TextIndice title="Taille" text={pokemon.height} />)
  }
  indices.push(<TextIndice title="Génération" text={pokemon.generation.toString()} />)
  indices.push(<TextIndice title="Catégorie" text={pokemon.category} />)
  indices.push(<ComponentIndice title="Faiblesses et résistances" component={<PokemonResistances pokemon={pokemon} types={types} />} />)
  indices.push(<PokemonTalent pokemon={pokemon} />)
  const description = pokemonDescription?.flavor_text_entries.find((desc) => desc.language.name == "fr");
  indices.push(<TextIndice title="Description" text={description != undefined ? description.flavor_text : "Aucune description disponible"} />)
  indices.push(<ComponentIndice title="Types" component={<PokemonTypesComponent pokemon={pokemon} />} />);
  indices.push(<TextIndice title="Id du pokedex" text={pokemon.pokedex_id.toString()} />)
  return indices;
}

export default function FrontPage({ pokemon, types, pokemonDescription }: FrontPageProps) {
  const [response, setResponse] = useState("");
  const [indexIndice, setIndexIndice] = useState(-1);

  const indices = getIndices(pokemon, types, pokemonDescription);
  console.log("pokemon", pokemon);

  function handleValidation() {
    if (response != pokemon.name.fr.toLocaleLowerCase()) {
      setIndexIndice(indexIndice + 1)
      setResponse("");
    }

    if (response == pokemon.name.fr.toLocaleLowerCase()) {
      alert("BRAVO tu as trouvé le pokémon");
    }
  }

  return (
    <div className="flex flex-col gap-2 justify-center items-center m-5">
      <p className="text-center font-bold text-2xl sm:text-4xl">Devine le pokemon</p>
      <div className="flex flex-row justify-center items-center gap-2">
        <SearchBar onChange={setResponse} value={response} className="w-[250px] sm:w-[500px]" />
        <Button size="default_responsive" className="h-12" onClick={handleValidation}>Valider</Button>
      </div>
      <div className="flex flex-row gap-2 flex-wrap justify-center items-center">
        {indices.map((indice: JSX.Element, index: number) => {
          if (index > indexIndice) return null;
          return (
            <div className="w-[300px]" key={`Indice-${index}`}>
              {indice}
            </div>
          )
        })}
      </div>
    </div>
  )
}