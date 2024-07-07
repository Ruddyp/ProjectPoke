import { Generation, Pokemon, Types } from "@/app/type";
import FrontPage from "./FrontPage";

async function getPokemons() {
  const url = "https://tyradex.vercel.app/api/v1/pokemon"
  const response = await fetch(url, {
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

async function getGenerations() {
  const url = "https://tyradex.tech/api/v1/gen"
  const response = await fetch(url, {
    method: 'GET',
  });
  return await response.json();
}

export default async function Page() {
  const pokemons: Pokemon[] = await getPokemons();
  const types: Types[] = await getTypes();
  let generations: Generation[] = await getGenerations();
  generations.forEach((generation: Generation) => {
    Object.assign(generation, { isActive: true });
  });
  return (
    <>
      <FrontPage pokemons={pokemons} types={types} generations={generations} />
    </>
  );
}
