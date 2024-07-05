import { PokeApiPokemonSpecies, Pokemon, Types } from "@/app/type";
import FrontPage from "./FrontPage";

async function getPokemon(id: string) {
  const pokemon = `https://tyradex.vercel.app/api/v1/pokemon/${id}`
  const response = await fetch(pokemon, {
    method: 'GET',
  });
  return await response.json();
}

async function getTypes() {
  const url = "https://tyradex.tech/api/v1/types"
  const response = await fetch(url, {
    method: 'GET',
  });
  return await response.json();
}

async function getPokemonDescription(id: string) {
  const url = `https://pokeapi.co/api/v2/pokemon-species/${id}`
  const response = await fetch(url, {
    method: 'GET',
  });
  return await response.json();
}

function getRandomInt(max = 1027) {
  return Math.floor(Math.random() * max);
}

export default async function Page() {
  const pokemon: Pokemon = await getPokemon(getRandomInt().toString());
  const types: Types[] = await getTypes();
  const pokemonDescription: PokeApiPokemonSpecies = await getPokemonDescription(pokemon.pokedex_id.toString());
  return (
    <>
      <FrontPage pokemon={pokemon} types={types} pokemonDescription={pokemonDescription} />
    </>
  );
}
