import { colors } from "@/lib/utils";
import { Pokemon, PokemonColorType, PokemonTypes } from "../type";
import FrontPage from "./FrontPage";

async function getPokemons() {
  const allPokemon = "https://tyradex.vercel.app/api/v1/pokemon"
  const gen1 = "https://tyradex.vercel.app/api/v1/gen/1"
  const response = await fetch(allPokemon, {
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

function getCardBgColor(types: PokemonTypes[] | null) {

  // Cas pour missing no ou il n'a pas de type, on renvoie un type normal en linear gradient
  if (types == null) {
    return {
      backgroundImage: `linear-gradient(to right bottom, ${colors['normal']} 20%, ${colors['normal_light']})`
    }
  }

  // Cas pour les autres pokemons on regarde s'il y a un ou deux types
  const colorType1 = types[0].name.toLowerCase() as PokemonColorType
  if (types.length > 1) {
    const colorType2 = types[1].name.toLowerCase() as PokemonColorType;
    return {
      backgroundImage: `linear-gradient(to right bottom, ${colors[colorType1]} 20%, ${colors[colorType2]})`
    }
  } else {
    const colorType1Light = `${colorType1}_light` as PokemonColorType;
    return {
      backgroundImage: `radial-gradient(circle 400px at 50% 200px,${colors[colorType1]},${colors[colorType1Light]})`
    }
  }
}

export default async function Page() {

  let pokemons = await getPokemons();
  pokemons.forEach((pokemon: Pokemon) => {
    Object.assign(pokemon, { cardStyle: getCardBgColor(pokemon.types) });
  });

  const types = await getTypes();
  return (
    <>
      <FrontPage pokemons={pokemons} types={types} />
    </>
  );
}
