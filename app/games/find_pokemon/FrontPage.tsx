'use client'

import { Generation, PokeApiPokemon, PokeApiPokemonSpecies, Pokemon, Types } from "@/app/type"
import ComponentIndice from "@/components/games/findPokemon/componentIndice"
import TextIndice from "@/components/games/findPokemon/textIndice"
import PokemonGenderStats from "@/components/generic/pokemonGenderStats"
import PokemonResistances from "@/components/generic/pokemonResistances"
import PokemonTalent from "@/components/generic/pokemonTalent"
import SearchBar from "@/components/searchBar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import PokemonTypesComponent from "@/components/generic/pokemonTypesComponent"
import GenerationFilter from "@/components/games/findPokemon/generationFilter"
import PokemonCri from "@/components/generic/pokemonCri"
import PokemonBlurImg from "@/components/generic/pokemonBlurImg"
import { RotateCcw } from "lucide-react"
import DialogSuccess from "@/components/games/findPokemon/diaglogSuccess"
import { ConfettiFireworks } from "@/lib/utils"

type FrontPageProps = {
  pokemons: Pokemon[];
  types: Types[];
  generations: Generation[];
}

function getIndices(pokemon: Pokemon | undefined, types: Types[], pokemonDescription: PokeApiPokemonSpecies | undefined, pokeApiPokemon: PokeApiPokemon | undefined) {
  if (pokemon == undefined || pokemonDescription == undefined || pokeApiPokemon == undefined) return undefined
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
  indices.push(<ComponentIndice title="Cri du pokémon" component={<PokemonCri pokeApiPokemon={pokeApiPokemon} />} />)
  indices.push(<PokemonTalent pokemon={pokemon} />)
  const description = pokemonDescription?.flavor_text_entries.find((desc) => desc.language.name == "fr");
  indices.push(<TextIndice title="Description" text={description != undefined ? description.flavor_text : "Aucune description disponible"} />)
  indices.push(<ComponentIndice title="Types" component={<PokemonTypesComponent pokemon={pokemon} />} />);
  indices.push(<TextIndice title="Id du pokedex" text={pokemon.pokedex_id.toString()} />)
  indices.push(<ComponentIndice title="Images du pokemon floutée" component={<PokemonBlurImg pokemon={pokemon} />} />);
  return indices;
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomPokemonFromActiveGeneration(generations: Generation[], pokemons: Pokemon[]): Pokemon | undefined {
  // Filtrer les générations actives
  const activeGenerations = generations.filter(gen => gen.isActive);

  // Si aucun élément actif n'est trouvé, retourner undefined
  if (activeGenerations.length === 0) {
    return undefined;
  }

  // Sélectionner aléatoirement un élément de l'array filtré
  const randomIndex = Math.floor(Math.random() * activeGenerations.length);
  const randomPokemonId = getRandomNumber(activeGenerations[randomIndex].from, activeGenerations[randomIndex].to);
  return pokemons.find((pokemon) => pokemon.pokedex_id == randomPokemonId)
}

export default function FrontPage({ pokemons, types, generations }: FrontPageProps) {
  const [generationFilter, setGenerationFilter] = useState(generations);
  const [pokemon, setPokemon] = useState<Pokemon | undefined>(getRandomPokemonFromActiveGeneration(generationFilter, pokemons));
  const [pokemonDescription, setPokemonDescription] = useState<PokeApiPokemonSpecies | undefined>(undefined);
  const [pokeApiPokemon, setPokeApiPokemon] = useState<PokeApiPokemon | undefined>(undefined)
  const [response, setResponse] = useState("");
  const [indexIndice, setIndexIndice] = useState(-1);
  const [congrats, setCongrats] = useState(false);

  const nbActiveGenerations = generationFilter.filter(gen => gen.isActive).length;

  useEffect(() => {
    setResponse("");
    setIndexIndice(-1)
    setPokemon(getRandomPokemonFromActiveGeneration(generationFilter, pokemons))
  }, [generationFilter, pokemons])

  useEffect(() => {
    async function getPokemonDescription(id: string) {
      const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`
      const response = await fetch(url, {
        method: 'GET',
      });
      const pokemonDescription: PokeApiPokemonSpecies = await response.json();
      setPokemonDescription(pokemonDescription);
    }

    async function getPokeApiInfo(id: string) {
      const url = `https://pokeapi.co/api/v2/pokemon/${id}`
      const response = await fetch(url, {
        method: 'GET',
      });
      const data: PokeApiPokemon = await response.json();
      setPokeApiPokemon(data);
    }

    if (pokemon == undefined) {
      setPokemonDescription(undefined);
      setPokeApiPokemon(undefined);
    } else {
      getPokemonDescription(pokemon.pokedex_id.toString());
      getPokeApiInfo(pokemon.pokedex_id.toString());
    }

  }, [pokemon])

  useEffect(() => {
    if (congrats == false) {
      setResponse("");
      setIndexIndice(-1)
      setPokemon(getRandomPokemonFromActiveGeneration(generationFilter, pokemons))
    }
  }, [congrats, generationFilter, pokemons])

  const indices = getIndices(pokemon, types, pokemonDescription, pokeApiPokemon);

  function handleValidation() {
    if (response != pokemon?.name.fr.toLocaleLowerCase()) {
      setIndexIndice(indexIndice + 1)
      setResponse("");
    }

    if (response == pokemon?.name.fr.toLocaleLowerCase()) {
      setCongrats(true);
      ConfettiFireworks();
    }
  }

  function handleRestart() {
    setIndexIndice(-1)
    setResponse("");
    setPokemon(getRandomPokemonFromActiveGeneration(generationFilter, pokemons))
  }

  return (
    <div className="flex flex-col gap-2 justify-center items-center m-5">
      <p className="text-center font-bold text-2xl sm:text-4xl">Devine le pokemon</p>
      <GenerationFilter generationFilter={generationFilter} setGenerationFilter={setGenerationFilter} />
      {congrats ? <DialogSuccess setCongrats={setCongrats} /> : null}
      {nbActiveGenerations === 0 ? <p>Veuillez sélectionner au moins une génération</p> : null}
      {nbActiveGenerations > 0 && indices != undefined ?
        <>
          <div className="sticky top-20 z-50 flex flex-row justify-center items-center gap-1 sm:gap-2">
            <SearchBar onChange={setResponse} value={response} className="w-[225px] sm:w-[500px]" />
            <Button size="default_responsive" className="w-[50px] sm:w-max h-12" onClick={handleValidation}>Valider</Button>
            <Button size="default_responsive" className="bg-gray-500 hover:bg-gray-600 w-[50px] sm:w-max h-12" onClick={handleRestart}><RotateCcw /></Button>
          </div>
          <div className="flex flex-col gap-2 flex-wrap justify-center items-center">
            {indices.map((indice: JSX.Element, index: number) => {
              if (index > indexIndice) return null;
              return (
                <div className="w-[300px] sm:w-[400px]" key={`Indice-${index}`}>
                  {indice}
                </div>
              )
            })
            }
          </div>
        </>
        : null
      }
    </div>
  )
}